const canvas=document.getElementById("screen"),ctx=canvas.getContext("2d");
const dialogue=document.getElementById("dialogue"),speakerEl=document.getElementById("speaker"),textEl=document.getElementById("text"),menu=document.getElementById("menu");
const W=960,H=540;
let state="title",room="intro",keys={},player={x:480,y:330,hp:30,maxhp:30,gold:12,xp:0},inventory={pebble:1},flags={},route={mercy:0,ruin:0,fracture:0},battle=null,dialogueState=null,started=false;

addEventListener("keydown",e=>{keys[e.key.toLowerCase()]=true;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();});
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);

function save(){localStorage.setItem("echoesBelow",JSON.stringify({room,player,inventory,flags,route}));}
function load(){let s=localStorage.getItem("echoesBelow");if(!s)return false;Object.assign(window,JSON.parse(s));return true}
function reset(){localStorage.removeItem("echoesBelow");location.reload();}
function say(n,t,cb){state="dialogue";dialogueState={n,t,i:0,cb};speakerEl.textContent=n;textEl.textContent="";dialogue.classList.remove("hidden");typeText();}
function typeText(){let d=dialogueState;if(d.i<d.t.length){textEl.textContent+=d.t[d.i++];setTimeout(typeText,12)}}
function advance(){if(state!=="dialogue")return;if(dialogueState.i<dialogueState.t.length){dialogueState.i=dialogueState.t.length;textEl.textContent=dialogueState.t;return}dialogue.classList.add("hidden");let cb=dialogueState.cb;dialogueState=null;state="world";if(cb)cb();}
function keyPressed(){return keys[" "]||keys["enter"]||keys["z"]}

function start(){started=true;state="world";room="intro";say("???","...hello?\n\nCan you hear me?\n\nThen keep your eyes open.",()=>say("SYSTEM","The ground gives way.",()=>{room="tunnels01";player.x=480;player.y=330;}));}
function drawWorld(){
 const r=ROOMS[room];ctx.fillStyle=r.color;ctx.fillRect(0,0,W,H);
 // simple pixel-art room
 ctx.strokeStyle="rgba(255,255,255,.15)";ctx.lineWidth=4;ctx.strokeRect(35,35,890,430);
 for(const [dir,to] of Object.entries(r.exits)){let x=dir==="west"?35:dir==="east"?925:480,y=dir==="north"?35:dir==="south"?465:250;ctx.fillStyle="#8b8b98";ctx.fillRect(x-18,y-18,36,36);}
 ctx.fillStyle="#fff";ctx.fillRect(player.x-10,player.y-10,20,20);
 let npcs=r.npcs||[];npcs.forEach((id,i)=>{let n=NPCS[id],x=160+i*130,y=210;ctx.fillStyle=n.color;ctx.fillRect(x-14,y-20,28,40);ctx.fillStyle="#fff";ctx.font="14px monospace";ctx.fillText(n.name,x-35,y-32)});
 ctx.fillStyle="#fff";ctx.font="20px monospace";ctx.fillText(r.name,55,65);
 ctx.font="16px monospace";ctx.fillText(`HP ${player.hp}/${player.maxhp}   GOLD ${player.gold}   LV ${1+Math.floor(player.xp/30)}`,55,500);
 ctx.fillStyle="#aaa";ctx.fillText("WASD/ARROWS move • SPACE interact • X/Esc menu",55,525);
}
function moveWorld(){
 let dx=0,dy=0;if(keys.arrowleft||keys.a)dx=-3;if(keys.arrowright||keys.d)dx=3;if(keys.arrowup||keys.w)dy=-3;if(keys.arrowdown||keys.s)dy=3;
 player.x=Math.max(60,Math.min(900,player.x+dx));player.y=Math.max(80,Math.min(440,player.y+dy));
 let r=ROOMS[room];
 if(player.x<55&&r.exits.west){room=r.exits.west;player.x=880;player.y=250;transition();}
 if(player.x>905&&r.exits.east){room=r.exits.east;player.x=80;player.y=250;transition();}
 if(player.y<55&&r.exits.north){room=r.exits.north;player.y=420;player.x=480;transition();}
 if(player.y>450&&r.exits.south){room=r.exits.south;player.y=80;player.x=480;transition();}
 if(Math.random()<(r.encounter||0)/60)startBattle(randomEnemy());
}
function transition(){save(); if(room==="core01"&&!flags.curator){flags.curator=true;say("The Curator","You made it this far.\n\nNow we find out what you chose.",()=>startBoss());}}
function randomEnemy(){let pool=room.startsWith("tunnels")?["rootling"]:room.startsWith("moss")?["moth"]:room.startsWith("ruins")?["gearling"]:["hollow"];return pool[Math.floor(Math.random()*pool.length)]}
function interact(){
 let r=ROOMS[room];
 if(r.shop){openShop();return}
 let npc=r.npcs?.find(id=>NPCS[id]);
 if(npc){let n=NPCS[npc];let line=n.lines[Math.floor(Math.random()*n.lines.length)];say(n.name,line,()=>{if(npc==="pip")flags.pip=true;if(npc==="eli")flags.eli=true;save()});return}
 if(room==="tunnels03"){say("SYSTEM","A crack in the wall reveals a warm pebble.",()=>{inventory.pebble=(inventory.pebble||0)+1;flags.pebble=true;});}
 else if(room==="moss03"){say("SYSTEM","You hear something beneath the roots. It sounds like a clock.",()=>route.fracture++);}
 else if(room==="hollow02"){say("???","You shouldn't be able to remember this room.",()=>{route.fracture+=3;flags.secret=true;save()});}
}
function openShop(){state="menu";menu.classList.remove("hidden");menu.innerHTML=`<b>MOSS & METAL</b><br><br>1. Warm Pebble — 8G<br>2. Root Tea — 14G<br>3. Glass Charm — 25G<br><br>Press 1/2/3 to buy • X to close`; }
function buy(n){let ids=["pebble","tea","charm"],id=ids[n];if(id&&player.gold>=ITEMS[id].price){player.gold-=ITEMS[id].price;inventory[id]=(inventory[id]||0)+1;save()}}
function randomAttack(){return Math.floor(Math.random()*7)+5}
function startBattle(id){battle={enemy:id,hp:ENEMIES[id].hp,max:ENEMIES[id].hp,turn:0,menu:0,acts:0};state="battle";}
function startBoss(){battle={enemy:"curator",hp:130,max:130,turn:0,menu:0,acts:0};state="battle";}
function battleDraw(){
 ctx.fillStyle="#08080c";ctx.fillRect(0,0,W,H);let e=ENEMIES[battle.enemy];
 ctx.fillStyle="#fff";ctx.font="28px monospace";ctx.fillText(e.name,70,75);ctx.font="17px monospace";ctx.fillStyle="#aaa";ctx.fillText(e.flavor,70,105);
 ctx.fillStyle="#fff";ctx.fillRect(400,155,160,160);ctx.fillStyle=battle.enemy==="curator"?"#ff4b5c":"#a98cff";ctx.fillRect(430,185,100,100);
 ctx.fillStyle="#fff";ctx.font="18px monospace";ctx.fillText(`Enemy HP: ${Math.max(0,battle.hp)}/${battle.max}`,70,350);
 ctx.fillText(`Your HP: ${player.hp}/${player.maxhp}`,70,380);
 ctx.fillText("ATTACK    ACT    ITEM    MERCY",70,450);
 ctx.fillText("↑ ↓ to choose • Z/Enter confirm",70,485);
 ctx.strokeStyle="#fff";ctx.strokeRect(65+battle.menu*190,415,170,48);
}
function battleInput(){
 if(keys.arrowleft){battle.menu=(battle.menu+3)%4;keys.arrowleft=false}
 if(keys.arrowright){battle.menu=(battle.menu+1)%4;keys.arrowright=false}
 if(!keyPressed())return;
 keys.z=keys.enter=keys[" "]=false;
 let choice=battle.menu;
 if(choice===0){battle.hp-=randomAttack();route.ruin++;enemyTurn();}
 if(choice===1){battle.acts++;route.mercy++;say("ACT","You studied "+ENEMIES[battle.enemy].name+".\nIt seems a little less hostile.",()=>enemyTurn());}
 if(choice===2){useItem();}
 if(choice===3){let chance=battle.enemy==="curator"?battle.acts>=2&&route.fracture>=3:.35; if(chance||Math.random()<.35){route.mercy++;say("SYSTEM",ENEMIES[battle.enemy].name+" leaves peacefully.",endBattle)}else{say("SYSTEM","It doesn't want to leave yet.",enemyTurn)}}
 if(battle.hp<=0)defeatEnemy();
}
function useItem(){let id=Object.keys(inventory).find(k=>inventory[k]>0&&ITEMS[k]);if(!id){say("SYSTEM","You have no usable items.",()=>enemyTurn());return}let it=ITEMS[id];inventory[id]--;player.hp=Math.min(player.maxhp,player.hp+it.heal);say("ITEM","You used "+it.name+".\nHP restored.",enemyTurn)}
function enemyTurn(){battle.turn++;setTimeout(()=>{player.hp-=Math.max(1,ENEMIES[battle.enemy].atk-Math.floor(battle.acts/2));if(player.hp<=0){player.hp=player.maxhp;route.ruin++;say("SYSTEM","You collapse... but the world puts you back together.",()=>{state="world";});}save()},300)}
function defeatEnemy(){let e=ENEMIES[battle.enemy];player.xp+=e.xp;player.gold+=e.gold;say("SYSTEM",e.name+" was defeated.",endBattle)}
function endBattle(){state="world";battle=null;save()}
function ending(){
 let title,body;
 if(route.fracture>=3&&flags.secret) {title="FRACTURE";body="You found the room that was never written.\nThe Deep was built from forgotten choices.\nNow you can finally choose what happens next."}
 else if(route.ruin>route.mercy+2){title="RUIN";body="The tunnels fall silent behind you.\nYou reached the door, but there is no one left to open it."}
 else {title="HARMONY";body="The last door opens.\nFor once, nobody has to disappear.\nThe Deep remembers you kindly."}
 return [title,body];
}
function drawTitle(){ctx.fillStyle="#050509";ctx.fillRect(0,0,W,H);ctx.fillStyle="#fff";ctx.font="58px monospace";ctx.textAlign="center";ctx.fillText("ECHOES BELOW",480,210);ctx.font="18px monospace";ctx.fillStyle="#aaa";ctx.fillText("AN ORIGINAL UNDERGROUND RPG EXPERIMENT",480,250);ctx.fillStyle="#fff";ctx.fillText("ENTER — NEW GAME",480,330);ctx.fillText("L — LOAD GAME",480,365);ctx.fillText("X — RESET SAVE",480,400);ctx.textAlign="left";}
function draw(){
 if(state==="title"){drawTitle();return}
 if(state==="world")drawWorld();
 if(state==="battle")battleDraw();
 if(state==="ending"){ctx.fillStyle="#050509";ctx.fillRect(0,0,W,H);let e=ending();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="48px monospace";ctx.fillText(e[0],480,190);ctx.font="20px monospace";e[1].split("\n").forEach((x,i)=>ctx.fillText(x,480,250+i*32));ctx.fillText("Press X to return to title",480,410);ctx.textAlign="left"}
}
function update(){
 if(state==="title"){if(keys.enter||keys.z||keys[" "]){keys.enter=keys.z=keys[" "]=false;start()}else if(keys.l){keys.l=false;if(load()){state="world"}else say("SYSTEM","No save found.")}else if(keys.x){keys.x=false;reset()} }
 else if(state==="dialogue"){if(keyPressed())advance()}
 else if(state==="world"){if(keyPressed()){keys.enter=keys.z=keys[" "]=false;interact()}moveWorld();if(keys.x||keys.escape){keys.x=keys.escape=false;save();state="title"}if(room==="core02"&&!battle){state="ending"}}
 else if(state==="battle")battleInput();
 else if(state==="menu"){if(keys["1"]){buy(0);keys["1"]=false}if(keys["2"]){buy(1);keys["2"]=false}if(keys["3"]){buy(2);keys["3"]=false}if(keys.x||keys.escape){keys.x=keys.escape=false;menu.classList.add("hidden");state="world"}}
 else if(state==="ending"&&keys.x){keys.x=false;state="title"}
 draw();requestAnimationFrame(update);
}
update();