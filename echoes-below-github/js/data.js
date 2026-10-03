const ROOMS={
 intro:{name:"The Fall",color:"#11111a",exits:{south:"tunnels01"},npcs:[]},
 tunnels01:{name:"Forgotten Tunnels",color:"#29251d",exits:{north:"intro",east:"tunnels02"},npcs:["mira"],encounter:0.008},
 tunnels02:{name:"Lantern Junction",color:"#30261e",exits:{west:"tunnels01",east:"moss01",south:"tunnels03"},npcs:["orin"],encounter:0.012},
 tunnels03:{name:"Collapsed Shaft",color:"#211d25",exits:{north:"tunnels02"},npcs:[],encounter:0.02},
 moss01:{name:"Mosswood Gate",color:"#17261c",exits:{west:"tunnels02",east:"moss02",south:"moss03"},npcs:["pip"],encounter:0.015},
 moss02:{name:"Whispering Grove",color:"#14241b",exits:{west:"moss01",east:"moss04"},npcs:["mira"],encounter:0.018},
 moss03:{name:"Root Cellar",color:"#211d16",exits:{north:"moss01"},npcs:[],encounter:0.02},
 moss04:{name:"Old Watchtower",color:"#1c2221",exits:{west:"moss02",east:"city01"},npcs:["warden"],encounter:0.018},
 city01:{name:"Glasswater Gate",color:"#17232d",exits:{west:"moss04",east:"city02",south:"city03"},npcs:["luma"],encounter:0.01},
 city02:{name:"Glasswater Market",color:"#202b34",exits:{west:"city01",south:"city04"},npcs:["shop"],shop:true},
 city03:{name:"Quiet Apartments",color:"#242027",exits:{north:"city01",east:"city04"},npcs:["eli"]},
 city04:{name:"Lakefront",color:"#102735",exits:{north:"city02",west:"city03",east:"ruins01"},npcs:["luma"],encounter:0.012},
 ruins01:{name:"Clockwork Ruins",color:"#252525",exits:{west:"city04",east:"ruins02",south:"ruins03"},npcs:[],encounter:0.02},
 ruins02:{name:"Pendulum Hall",color:"#302922",exits:{west:"ruins01",east:"ruins04"},npcs:["keeper"],encounter:0.025},
 ruins03:{name:"Maintenance Vault",color:"#211f24",exits:{north:"ruins01"},npcs:[]},
 ruins04:{name:"The Laboratory",color:"#25232c",exits:{west:"ruins02",east:"hollow01"},npcs:["doctor"]},
 hollow01:{name:"The Hollow",color:"#130f19",exits:{west:"ruins04",east:"hollow02"},npcs:["echo"],encounter:0.03},
 hollow02:{name:"Unwritten Room",color:"#0c0b11",exits:{west:"hollow01",east:"core01"},npcs:[],encounter:0.04},
 core01:{name:"The Core",color:"#18101b",exits:{west:"hollow02",east:"core02"},npcs:["antagonist"]},
 core02:{name:"The Last Door",color:"#08080d",exits:{west:"core01"},npcs:[]}
};

const NPCS={
 mira:{name:"Mira",color:"#f0b6ff",lines:[
  "You fell farther than anyone should be able to fall.",
  "The Deep doesn't always put people back where it found them.",
  "If you meet someone who remembers you, ask what they remember."
 ]},
 orin:{name:"Orin",color:"#ff9b67",lines:["A map? I sell maps. Whether they're correct is a separate product.","Take the eastern path if you're brave."]},
 pip:{name:"Pip",color:"#a6ff9d",lines:["Hi! I'm Pip! I collect lost things.","I found this button three times. It keeps coming back."]},
 warden:{name:"Warden Vale",color:"#b8d8ff",lines:["This forest is older than the city.","Please don't disturb the roots beneath the watchtower."]},
 luma:{name:"Luma",color:"#8de7ff",lines:["Glasswater reflects things that aren't there.","If the lake shows you another room, don't enter it."]},
 eli:{name:"Eli",color:"#ffd58a",lines:["My sibling went toward the laboratory.","I keep telling myself they'll come home."]},
 shop:{name:"Moss & Metal",color:"#ffe08a",lines:["Welcome. Buy something useful before the road gets strange."]},
 keeper:{name:"The Keeper",color:"#d6d6d6",lines:["Every clock in this place measures a different regret."]},
 doctor:{name:"Dr. Venn",color:"#e8e8ff",lines:["The Deep isn't a place. It's a memory with architecture."]},
 echo:{name:"Echo",color:"#ff7aa8",lines:["I've heard your footsteps before.","Not in this timeline."]},
 antagonist:{name:"The Curator",color:"#ff4b5c",lines:["At last. The variable has arrived.","You have been choosing a shape for this world."]},
};

const ENEMIES={
 rootling:{name:"Rootling",hp:18,atk:4,xp:6,gold:3,acts:["Listen","Compliment"],flavor:"It is waiting for sunlight."},
 moth:{name:"Whisper Moth",hp:24,atk:5,xp:9,gold:5,acts:["Hum","Observe"],flavor:"Its wings remember a song."},
 gearling:{name:"Gearling",hp:32,atk:7,xp:13,gold:7,acts:["Wind","Polish"],flavor:"It wants to be useful."},
 hollow:{name:"Hollow Echo",hp:42,atk:9,xp:18,gold:10,acts:["Remember","Question"],flavor:"It copies your last thought."},
 curator:{name:"The Curator",hp:130,atk:12,xp:0,gold:0,acts:["Ask","Refuse","Remember"],flavor:"It has catalogued every ending."}
};

const ITEMS={
 pebble:{name:"Warm Pebble",price:8,heal:12,desc:"A stone that refuses to get cold."},
 tea:{name:"Root Tea",price:14,heal:24,desc:"Earthy, sweet, surprisingly calming."},
 charm:{name:"Glass Charm",price:25,heal:40,desc:"A tiny lake trapped in glass."}
};