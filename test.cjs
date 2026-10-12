const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(__dirname + '/index.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(source);
const noop = () => {};
const elements = {};
const rectangles=[];
const element = () => ({textContent: '', addEventListener: noop, focus: noop, getContext: () => new Proxy({}, {get: (_,key) => key==='fillRect'? (...args)=>rectangles.push(args):noop})});
const context = {rectangles,document: {getElementById: id => elements[id] ?? (elements[id] = element()), querySelectorAll: () => []}, window: {addEventListener: noop}, requestAnimationFrame: noop, performance: {now: () => 0}, console, Math};
vm.createContext(context);
vm.runInContext(source, context);
vm.runInContext(`
function check(condition, message) { if (!condition) throw Error(message); }
start(); check(lives===3 && boxes.length===10, 'initial state');
const initialWalls=JSON.stringify(walls),initialColor=wallColor(),initialDelay=laserDelay();
check(!exitOpen(), 'initial exit closed'); player.x=79; step(1/120); check(room===1 && player.x===5 && lives===3, 'closed exit transports without death');
boxes.slice(0,5).forEach(b=>b.on=false); check(!exitOpen(), 'five boxes insufficient');
boxes[5].on=false; check(exitOpen(), 'six boxes open exit'); boxes[5].on=true; check(!exitOpen(), 'regeneration closes exit'); boxes[5].on=false;
player.x=79; step(1/120);
check(room===2 && player.x===5 && boxes.length===10, 'right exit works with six disabled');
check(!exitOpen() && boxes.every(b=>b.on), 'new room restores closed exit');
rectangles.length=0;draw();check(rectangles.some(r=>r[0]===316&&r[1]===0&&r[2]===4&&r[3]===192),'new room right wall is rendered');
const target={x:20,y:20,on:true};
check(missileHitsBox({x:18,y:21.4},{x:22,y:21.4},target),'bottom of visible box registers');
check(missileHitsBox({x:20.9,y:18},{x:20.9,y:23},target),'right side registers');
check(missileHitsBox({x:22,y:21},{x:18,y:21},target),'reverse shot registers');
check(missileHitsBox({x:18,y:18},{x:23,y:23},target),'diagonal sweep registers');
check(!missileHitsBox({x:18,y:22},{x:22,y:22},target),'clear miss remains a miss');
check(wallColor()!==initialColor && laserDelay()<initialDelay, 'new color and faster laser');
check(JSON.stringify(walls)!==initialWalls, 'new wall layout');
boxes.forEach(b=>b.on=false); player.x=79; step(1/120);
check(room===3 && score===5, 'all-box bonus');
for(let i=0;i<1;i++){const delay=laserDelay(),warning=warningDelay(),color=wallColor();boxes.slice(0,6).forEach(b=>b.on=false);player.x=79;step(1/120);check(laserDelay()<delay && warningDelay()<warning,'progressive laser speed');check(wallColor()!==color,'consecutive wall colors');check(boxes.length===10 && state==='play','ordinary rooms');check(!walls.some(w=>rectHit(player.x,player.y,.45,w)),'safe spawn');check(boxes.every(b=>safe(b.x,b.y,1)),'safe box locations');}
die(); die(); die(); check(state==='over', 'three lives');
start();
pause(); const oldX=player.x; keys.add('d'); step(1); check(player.x===oldX, 'pause'); pause();
keys.clear();laser.phase='warning';laser.target={x:player.x,y:player.y};laser.timer=0;step(1/120);check(lives===2,'laser hits stationary player');
walls=[];boxes=[{x:20,y:20,on:true}];bullet={x:19.7,y:21.4,dx:1,dy:0};const previousScore=score;step(1/120);check(!boxes[0].on&&bullet===null&&score===previousScore+1,'visible edge hit disables box and scores');
laser.phase='warning';laser.target={x:25,y:40};laser.timer=0;step(1/120);check(lives===2,'laser can be dodged');
for(let r=1;r<=4;r++){room=r;setupRoom();const b=boxes[0];b.on=false;b.disabledFor=boxDisableSeconds();check(b.disabledFor===32-r*2,'room-specific duration');updateBoxes(32-r*2-.01);check(!b.on,'no early regeneration');updateBoxes(.01);check(b.on,'regenerates at deadline');}
start();walls=[];boxes=[{x:20,y:20,on:true}];laser.timer=999;bullet={x:19.7,y:21,dx:1,dy:0};step(1/120);check(boxes[0].disabledFor===30,'actual shot starts full thirty seconds');
for(let n=0;n<1800;n++)step(1/120);const remaining=boxes[0].disabledFor;die();check(!boxes[0].on&&boxes[0].disabledFor===remaining,'death preserves remaining disable timer');laser.timer=999;
for(let n=0;n<1799;n++)step(1/120);check(!boxes[0].on,'still disabled just before thirty gameplay seconds');step(1/120);check(boxes[0].on,'returns after full thirty gameplay seconds across respawn');
room=1;setupRoom();boxes[0].on=false;boxes[0].disabledFor=10;boxes[1].on=false;boxes[1].disabledFor=8;updateBoxes(8);check(!boxes[0].on&&boxes[1].on,'independent box timers');
room=5;setupRoom();check(boxes.length===0&&walls.length===0&&computerCore.hp===8,'unique computer room');check(new Set(bricks.map(b=>b.layer)).size===5,'five armor layers');check(!exitOpen(),'computer exit locked');
laser.timer=0;updateBossLaser(.01);check(laser.phase==='warning'&&bottomLaser.phase==='shield','top aims first');player.x=10;player.y=12;laser.timer=0;updateBossLaser(.01);check(beam.a.y===6&&laserTurn===1,'top fires');laser.timer=0;updateBossLaser(.01);check(bottomLaser.phase==='warning','bottom aims next');player.x=15;player.y=20;laser.timer=0;updateBossLaser(.01);check(beam.a.y===42&&laserTurn===0,'bottom fires then top');
laser.timer=999;player.x=5;player.y=24;
const brickCount=bricks.filter(b=>b.on).length;bullet={x:24.4,y:24.5,dx:1,dy:0};step(1/120);check(bricks.filter(b=>b.on).length===brickCount-1&&computerCore.hp===8,'brick absorbs shot');
// Fire from outside through a corridor; five layers require five separate shots.
setupRoom();laser.timer=999;player.y=24;player.x=5;
function fireAcross(){bullet={x:20,y:24,dx:1,dy:0};for(let n=0;n<200&&bullet;n++)step(1/120);}
for(let n=0;n<5;n++){fireAcross();check(computerCore.hp===8,'armor protects core');}
fireAcross();check(computerCore.hp===7,'sixth shot reaches core');
for(let n=0;n<7;n++)fireAcross();check(computerCore.hp===0&&exitOpen()&&!laser.alive&&!bottomLaser.alive,'core destruction opens exit and stops lasers');
player.x=79;step(1/120);check(state==='won','boss escape completes mission');go();check(room===1&&mission===2&&boxes.length===10&&!exitOpen(),'next mission resets');
start();walls=[];boxes=[];laser.phase='warning';laser.timer=10;bullet={x:38.4,y:2,dx:1,dy:0};step(1/120);check(!laser.alive&&score===5&&bullet===null,'left side exposed laser hit');
laser.alive=true;laser.phase='warning';laser.timer=10;bullet={x:41.2,y:2,dx:-1,dy:0};step(1/120);check(!laser.alive&&score===5,'right side recovered laser hit without repeat bonus');
laser.alive=true;laser.phase='shield';check(hitLaser({x:35,y:2},{x:36,y:2},laser,false)&&laser.alive,'raised shield blocks side shot');
room=5;setupRoom();bottomLaser.phase='warning';check(hitLaser({x:38,y:46},{x:40,y:46},bottomLaser,true)&&!bottomLaser.alive,'bottom boss laser side hit');updateBossLaser(12);check(bottomLaser.alive,'boss laser recovers');
start();addScore(19);check(lives===3,'no life below milestone');addScore(1);check(lives===4&&score===20,'extra life at twenty');addScore(1);check(lives===4,'no duplicate life');addScore(39);check(lives===6&&score===60,'large bonus crosses two milestones');die();check(lives===5,'earned life can be lost');addScore(20);check(lives===6,'next milestone still awards life');start();check(score===0&&lives===3&&lifeBonusTime===0,'restart resets rewards');addScore(20);check(lives===4,'new game can earn milestone again');
draw(); console.log('PASS: gameplay and extra lives at every 20 points, multiple milestones, no duplicate awards, death and restart');
`, context);