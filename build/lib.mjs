import fs from 'node:fs';import * as cheerio from 'cheerio';
export const facts=JSON.parse(fs.readFileSync(new URL('../data/facts.json',import.meta.url)));
export const dictionary=JSON.parse(fs.readFileSync(new URL('../data/i18n.json',import.meta.url)));
export const versions={general:{path:'/',label:'BRAND PROFILE'},leasing:{path:'/leasing/',label:'LEASING PROFILE'},investment:{path:'/investors/',label:'INVESTMENT PROFILE'},partnership:{path:'/partners/',label:'PARTNERSHIP PROFILE'},career:{path:'/careers/',label:'CAREER PROFILE'},executive:{path:'/executive/',label:'EXECUTIVE PROFILE'},brief:{path:'/brief/',label:'VISUAL BRAND PROFILE'}};
export function get(path){let value=facts;for(const key of path.split('.')){if(Array.isArray(value)&&!/^\d+$/.test(key))value=value.find(x=>x.id===key);else value=value?.[key];}return value;}
export function escape(value){return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));}
export function renderTokens(source){return source.replace(/\{\{([\w.]+)(?:\|(\w+))?\}\}/g,(_,path,format)=>{let val=get(path);if(val===undefined)throw Error('Unknown fact path: '+path);if(val===null)return '';if(format==='number')val=typeof val==='number'?val.toLocaleString('en-US',{maximumFractionDigits:2}):val;if(format==='rating')val=Number(val).toFixed(1);if(format==='compact')val=Intl.NumberFormat('en-US',{notation:'compact'}).format(val);if(format==='digits')val=val.replace(/\D/g,'');if(format==='join'||format==='confirmed')val=val.filter(x=>x!==null).join(' · ');return escape(val);});}
export function loadMaster(){return cheerio.load(fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'));}
export function prune($,version){$('[data-ver]').each((_,e)=>{if(!$(e).attr('data-ver').split(/\s+/).includes(version))$(e).remove();});$('[data-if-fact]').each((_,e)=>{if(!get($(e).attr('data-if-fact')))$(e).remove();});}
export function buildVersion(version){const $=loadMaster();prune($,version);$('body').attr('data-profile',version);$('html').attr('data-profile',version);
$('base').remove();$('head').prepend('<base href="/">');$('meta[name="sura-build"]').remove();
const label=`${versions[version].label} · ${facts.brand.profile_month}`;$('[data-i18n="cover.label"]').removeAttr('data-i18n').text(label);$('title').text(`SURA — ${versions[version].label}`);$('link[rel=canonical],meta[property="og:url"]').each((_,e)=>$(e).attr(e.name==='link'?'href':'content',facts.brand.website+versions[version].path));
// Section IDs removed at build time must not leave dead navigation links.
$('a[href^="#"]').each((_,e)=>{let id=$(e).attr('href').slice(1);if(id&&!$(`[id="${id}"]`).length)$(e).remove();});
$('[data-map]').each((_,e)=>{let s=facts.stores.find(s=>s.id===$(e).attr('data-map'));$(e).html(s?.map?`<a href="${escape(s.map)}" target="_blank" rel="noopener noreferrer" data-i18n="ui.map">Google Maps</a>`:'');});
$('[data-store-maps]').html(facts.stores.filter(s=>s.map).map(s=>`<a href="${escape(s.map)}">${escape(s.name)}</a>`).join(' · '));
$('[data-status]').each((_,e)=>{const key=$(e).attr('data-status');let state=key==='app'?facts.operations.manager_app.status:facts.operations.divisions.find(d=>d.id===key)?.status;if(state==='live')$(e).attr('data-i18n','ui.live').text('In operation');else $(e).remove();});
$('[data-investment]').each((_,e)=>{const key=$(e).attr('data-investment');const val=facts.investment[key];if(val!=null)$(e).text(val);else if(key==='model_summary')$(e).empty();else $(e).attr('data-i18n','investment.available').text(dictionary.en['investment.available']);});
$('[data-executive-stores]').html('<div class="executive-store-list">'+facts.stores.map(s=>`<div><strong>${escape(s.name)}</strong><br>${escape(s.city)}${s.map?` · <a href="${escape(s.map)}" data-i18n="ui.map">Google Maps</a>`:''}</div>`).join('')+'</div>');
$('[data-executive-highlights]').html(`<div class="profile-grid"><article class="profile-card"><h3>{{kpi.google_avg}}</h3><span data-i18n="glance.k4.l">Average Google Rating</span></article><article class="profile-card"><h3>{{kpi.google_reviews|number}}</h3><span data-i18n="glance.k3.l">Google Reviews</span></article><article class="profile-card"><h3>{{kpi.stores}}</h3><span data-i18n="nav.stores">Stores</span></article><article class="profile-card"><h3>{{stores.pakuwon.turns_per_day}}</h3><span data-i18n="ex.turns">Surabaya turns per day</span></article></div><p class="source-line">{{kpi.reviews_verified_at}} · {{stores.pakuwon.turns_period}}</p>`);
$('[data-version-meta]').text(`${version} · v${facts.version} · Updated ${facts.updated_at} · Owner ${facts.owner[version]}`);
// Retain only reachable detail panels, including no hidden private panels in the source.
let keys=new Set($('main [data-detail]').map((_,e)=>$(e).attr('data-detail')).get());$('#dtStore>.dt').each((_,e)=>{const key=$(e).attr('id').slice(3);if(!keys.has(key))$(e).remove();else{$(e).find('[data-detail]').remove();$(e).find('[data-card-detail]').removeAttr('data-card-detail');$(e).find('[data-rv]').removeAttr('data-rv');}});
$('[data-card-detail]').each((_,e)=>{if(!keys.has($(e).attr('data-card-detail')))$(e).removeAttr('data-card-detail');});
// Inline each panel beside its section for CSS-only print expansion; template keeps a single DOM copy.
$('#dtStore>.dt').each((_,e)=>{let section=$('#'+$(e).attr('data-section'));if(section.length)section.append(`<div class="print-details" data-print-panel="${$(e).attr('id')}"></div>`);});
$('#dlg .dlg-lbl').attr('id','dlgLabel').removeAttr('data-i18n').empty();$('.dlg-box').append('<button class="btn-more" id="dlgBottomClose" type="button" data-i18n="ui.close">Close</button>');
// Translate every surviving key and remove all dictionaries for excluded modules.
const keysUsed=new Set($('[data-i18n]').map((_,e)=>$(e).attr('data-i18n')).get());keysUsed.add('ui.close');let bundle={};for(const lang of ['en','ko','id','zh']){bundle[lang]={};for(const key of keysUsed){if(dictionary[lang]?.[key]===undefined)throw Error(`Missing ${lang}:${key}`);bundle[lang][key]=renderTokens(dictionary[lang][key]);}}
$('[data-i18n]').each((_,e)=>$(e).html(bundle.en[$(e).attr('data-i18n')]));
const json=JSON.stringify(bundle).replace(/</g,'\\u003c');let html=$.html().replace('<!-- PROFILE_I18N -->',`<script>window.SURA_I18N = ${json};</script>`);html=renderTokens(html);
if(version==='investment')html=html.replace('</head>','<meta name="robots" content="noindex, nofollow, noarchive"></head>');
if(/\{\{/.test(html))throw Error('Unresolved tokens '+version+' '+html.match(/.{0,30}\{\{.{0,150}/g)?.slice(0,8));if(Buffer.byteLength(html)>1_000_000)throw Error('HTML over 1 MB');return html;
}
