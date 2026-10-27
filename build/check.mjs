import fs from 'node:fs';import {loadMaster,dictionary,renderTokens} from './lib.mjs';
const $=loadMaster(),mode=process.argv[2];let errors=[];
if(mode==='i18n'){
 const keys=new Set($('[data-i18n]').map((_,e)=>$(e).attr('data-i18n')).get());
 for(const l of ['en','ko','id','zh'])for(const k of keys){if(dictionary[l]?.[k]===undefined)errors.push(`${l}: ${k}`);else renderTokens(dictionary[l][k]);}
 console.log(`Checked ${keys.size} keys in four languages`);
}else if(mode==='facts'){
 const inspect=(text,context)=>{const clean=text.replace(/\{\{[^}]+\}\}/g,'').replace(/<[^>]*>/g,'');if(/\d{2,}/.test(clean))errors.push(context+': '+clean.slice(0,160));renderTokens(text);};
 $('script,style').remove();
 function walk(node){for(const child of node.children||[]){if(child.type==='text')inspect(child.data,'HTML');else walk(child);}}walk($.root()[0]);
 for(const [l,entries]of Object.entries(dictionary))for(const [key,text]of Object.entries(entries))inspect(text,`${l}:${key}`);
 console.log('Checked visible master text and every translation; no business-number allowlist');
}else throw Error('Use i18n or facts');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log('PASS');
