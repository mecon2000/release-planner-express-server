//TODO use import instead of require
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.listen(3333, () => {
  console.log("Server running on port 3333");
});

app.get("/groups", (req, res, next) => {
  res.json(["Web", "Core", "Scanner"]);
});

const devDetails = [
  { name: "Spiders", group: "Web", devs: ["shay-FE", "lior-BE"] },
  { name: "Sharks", group: "Web", devs: ["Jenny-FE", "Shanni-BE"] },
  { name: "Threads", group: "Web", devs: ["Tolik-BE", "Daniel-FE"] },
  { name: "Gold Strikers", group: "Core", devs: [] },
  { name: "Goblins", group: "Core", devs: [] },
  { name: "Blues", group: "Core", devs: [] },
  { name: "Seals", group: "Scanner", devs: [] },
  { name: "Team 13", group: "Scanner", devs: [] }
];

app.get("/teams/withDevs", (req, res, next) => {
  res.json(devDetails);
});

app.get("/teams", (req, res, next) => {
  res.json(devDetails.map(dev => ({ name: dev.name, group: dev.group })));
});

app.get("/releases", (req, res, next) => {
  res.json([
    { name: "20A5", startDate: "2/2/2020", endDate: "1/3/2020" },
    { name: "20B", startDate: "14/2/2020", endDate: "1/4/2020" },
    { name: "20C", startDate: "2/4/2020", endDate: "1/8/2020" }
  ]);
});

// prettier-ignore
const devs = [
      { name: "Shay-FE", team: "Spiders", capacity: {w5:"5", w6:"5", w7:"5", w8:"5", w9:"5", w10:"5", w11:"5", w12:"5"} },
      { name: "lior-BE", team: "Spiders", capacity: {w5:"5", w6:"5", w7:"5", w8:"5", w9:"5", w10:"5", w11:"5", w12:"5"} },
      { name: "Jenny-FE", team: "Sharks", capacity: {w5:"5", w6:"5", w7:"5", w8:"5", w9:"5", w10:"5", w11:"5", w12:"5"} },
      { name: "Shanni-BE", team: "Sharks", capacity: {w5:"5", w6:"5", w7:"5", w8:"5", w9:"5", w10:"5", w11:"5", w12:"5"} },
      { name: "Tolik-BE", team: "Threads", capacity: {w5:"5", w6:"5", w7:"5", w8:"5", w9:"5", w10:"5", w11:"5", w12:"5"} },
      { name: "Daniel-FE", team: "Threads", capacity: {w5:"5", w6:"5", w7:"5", w8:"5", w9:"5", w10:"5", w11:"5", w12:"5"} }
];

app.get("/devs", (req, res, next) => {    
    res.json(devs)
});

app.get("/devs&team=:team", (req, res, next) => {    
    const devsOnSpecificTeam = devs.filter(dev => dev.team.toLowerCase() === req.params["team"].toLowerCase())
    res.json(devsOnSpecificTeam)
});

app.get("/weekDates", (req, res, next) => {
  res.json(["w5", "w6", "w7", "w8", "w9", "w10", "w11", "w12"]);
});

// prettier-ignore
app.get("/epics", (req, res, next) => {
    res.json([
      { name: 'Snapshot wave 2',             shortName: 'snapshot w2', release:'20B' , priority:'100', program:'ortho', estimations:{FE:{est:'15', max_parallel:'1'}, BE:{est:'6', max_parallel:'1'}, Core:{est:'5', max_parallel:'1'}, Scanner:{est:'0', max_parallel:'0'}, MSK:{est:'0', max_parallel:'0'}, ALG:{est:'0', max_parallel:'0'}}, candidate_teams: ['Spiders','Gold Strikers']},
      { name: 'Patient-management with IDS', shortName: 'patient-mng', release:'20B' , priority:'200', program:'ortho', estimations:{FE:{est:'10', max_parallel:'1'}, BE:{est:'15', max_parallel:'1'}, Core:{est:'7', max_parallel:'1'}, Scanner:{est:'0', max_parallel:'1'}, MSK:{est:'0', max_parallel:'1'}, ALG:{est:'0', max_parallel:'1'}}, candidate_teams: ['Sharks','Gold Strikers']},
      { name: 'Texture mapping',             shortName: 'texture'    , release:'20B' , priority:'300', program:'ortho', estimations:{FE:{est:'10', max_parallel:'1'}, BE:{est:'0',  max_parallel:'1'}, Core:{est:'10',max_parallel:'1'}, Scanner:{est:'0', max_parallel:'1'}, MSK:{est:'0', max_parallel:'1'}, ALG:{est:'0', max_parallel:'1'}}, candidate_teams: ['Spiders','Gold Strikers']},
      { name: 'Account management',          shortName: 'accnt-mng'  , release:'20A5', priority:'50' , program:'ortho', estimations:{FE:{est:'15', max_parallel:'1'}, BE:{est:'15', max_parallel:'1'}, Core:{est:'0', max_parallel:'0'}, Scanner:{est:'0', max_parallel:'0'}, MSK:{est:'0', max_parallel:'0'}, ALG:{est:'0', max_parallel:'0'}}, candidate_teams: ['Spiders']},
    ]);
  });

/*
getTeams, //group it belongs to, devs and their skill sets
getReleases
getDev  (with name+skillset, team, capacity). can get all devs in a team with param
getWeekDates
epics (name, short name, priority, program, efforts for all skillsets, prefered team to implement)
*/
