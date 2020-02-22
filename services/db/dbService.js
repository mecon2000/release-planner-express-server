let firebase = require('firebase-admin');
let serviceAccount = require('./serviceAccountKey.json');

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://releaseplanner-902dc.firebaseio.com'
});

let db = firebase.database();

//#region getters

const getGroups = async () => {
  let data = await db.ref('groups').once('value');
  return data.val();
};

const getDevsWithDetails = async () => {
  let data = await db.ref('teams').once('value');
  return data.val();
};

const getReleases = async () => {
  let data = await db.ref('releases').once('value');
  return data.val();
};

const getDevsCapacity = async () => {
  let data = await db.ref('devs').once('value');
  return data.val();
};

const getEpics = async () => {
  let data = await db.ref('epics').once('value');
  return data.val();
};

const getPlans = async teamName => {
  const pathToData = teamName ? `plans/${teamName}` : `plans`;
  let data = await db.ref(pathToData).once('value');
  return data.val();
};

//#endregion getters

//#region setters

const setPlans = async (teamName, newPlans) => {
  const pathToData = teamName ? `plans/${teamName}` : `plans`;
  let ref = db.ref(pathToData);
  await ref.set(newPlans);
};

//#endregion setters

//#region initializing the DB

const resetToInitialDB = async () => {
  setInitialGroups();
  setInitialTeams();
  setInitialDevsCapacity();
  setInitialReleases();
  setInitialEpics();
  //setInitialPlans();
};

const setInitialGroups = async () => {
  let ref = db.ref('groups');
  await ref.set(['core', 'web', 'scanner']);
};

const setInitialTeams = async () => {
  const devDetails = [
    { name: 'spiders', group: 'Web', devs: ['shay-FE', 'lior-BE'] },
    { name: 'sharks', group: 'Web', devs: ['Jenny-FE', 'Shanni-BE'] },
    { name: 'threads', group: 'Web', devs: ['Tolik-BE', 'Daniel-FE'] },
    { name: 'gold strikers', group: 'Core', devs: [] },
    { name: 'goblins', group: 'Core', devs: [] },
    { name: 'blues', group: 'Core', devs: [] },
    { name: 'seals', group: 'Scanner', devs: [] },
    { name: 'team 13', group: 'Scanner', devs: [] }
  ];

  let ref = db.ref('teams');
  await ref.set(devDetails);
};

const setInitialDevsCapacity = async () => {
  // prettier-ignore
  const devs = [
    { name: "Shay-FE", team: "spiders", capacity: {w05:"5", w06:"5", w07:"5", w08:"5", w09:"5", w10:"5", w11:"5", w12:"5"} },
    { name: "lior-BE", team: "spiders", capacity: {w05:"5", w06:"5", w07:"5", w08:"5", w09:"5", w10:"5", w11:"5", w12:"5"} },
    { name: "Jenny-FE", team: "sharks", capacity: {w05:"5", w06:"5", w07:"5", w08:"5", w09:"5", w10:"5", w11:"5", w12:"5"} },
    { name: "Shanni-BE", team: "sharks", capacity: {w05:"5", w06:"5", w07:"5", w08:"5", w09:"5", w10:"5", w11:"5", w12:"5"} },
    { name: "Tolik-BE", team: "threads", capacity: {w05:"5", w06:"5", w07:"5", w08:"5", w09:"5", w10:"5", w11:"5", w12:"5"} },
    { name: "Daniel-FE", team: "threads", capacity: {w05:"5", w06:"5", w07:"5", w08:"5", w09:"5", w10:"5", w11:"5", w12:"5"} }
  ];
  let ref = db.ref('devs');
  await ref.set(devs);
};

const setInitialReleases = async () => {
  const releases = [
    { name: '20A5', startDate: '2/2/2020', endDate: '1/3/2020' },
    { name: '20B', startDate: '14/2/2020', endDate: '1/4/2020' },
    { name: '20C', startDate: '2/4/2020', endDate: '1/8/2020' }
  ];
  let ref = db.ref('releases');
  await ref.set(releases);
};

const setInitialEpics = async () => {
  // prettier-ignore
  const epics = [
    { name: 'Snapshot wave 2',              shortName: 'snapshot w2', release: '20B', priority: '100', program: 'ortho', estimations: {FE: { est: '15', max_parallel: '1' }, BE: { est: '6',  max_parallel: '1' }, Core: { est: '5',  max_parallel: '1' }, Scanner: { est: '0', max_parallel: '0' }, MSK: { est: '0', max_parallel: '0' }, ALG: { est: '0', max_parallel: '0' }}, candidate_teams: ['spiders', 'gold strikers']},
    { name: 'Patient-management with IDS',  shortName: 'patient-mng', release: '20B', priority: '200', program: 'ortho', estimations: {FE: { est: '10', max_parallel: '1' }, BE: { est: '15', max_parallel: '1' }, Core: { est: '7',  max_parallel: '1' }, Scanner: { est: '0', max_parallel: '1' }, MSK: { est: '0', max_parallel: '1' }, ALG: { est: '0', max_parallel: '1' }}, candidate_teams: ['sharks', 'gold strikers']},
    { name: 'Texture mapping',              shortName: 'texture',     release: '20B', priority: '300', program: 'ortho', estimations: {FE: { est: '10', max_parallel: '1' }, BE: { est: '0',  max_parallel: '1' }, Core: { est: '10', max_parallel: '1' }, Scanner: { est: '0', max_parallel: '1' }, MSK: { est: '0', max_parallel: '1' }, ALG: { est: '0', max_parallel: '1' }}, candidate_teams: ['spiders', 'gold strikers']},
    { name: 'Account management',           shortName: 'accnt-mng',   release: '20A5',priority: '50',  program: 'ortho', estimations: {FE: { est: '15', max_parallel: '1' }, BE: { est: '15', max_parallel: '1' }, Core: { est: '0',  max_parallel: '0' }, Scanner: { est: '0', max_parallel: '0' }, MSK: { est: '0', max_parallel: '0' }, ALG: { est: '0', max_parallel: '0' }}, candidate_teams: ['spiders']}
  ];
  let ref = db.ref('epics');
  await ref.set(epics);
};

const setInitialPlans = async () => {
  // prettier-ignore
  const plans = { 
    spiders: 
    [
      { week: 'w05', epics: [{dev:'shay-FE', epicName: "snapshot"}, {dev:'Lior-BE', epicName: "snapshot"}]},
      { week: 'w06', epics: [{dev:'shay-FE', epicName: "snapshot"}, {dev:'Lior-BE', epicName: "snapshot"}]},
      { week: 'w07', epics: [{dev:'shay-FE', epicName: "snapshot"}, {dev:'Lior-BE', epicName: "snapshot"}]},
      { week: 'w08', epics: [{dev:'shay-FE', epicName: "accnt-Mng"}, {dev:'Lior-BE', epicName: "accnt-Mng"}]},
      { week: 'w09', epics: [{dev:'shay-FE', epicName: "accnt-Mng"}, {dev:'Lior-BE', epicName: "accnt-Mng"}]},
      { week: 'w10', epics: [{dev:'shay-FE', epicName: "accnt-Mng"}, {dev:'Lior-BE', epicName: "accnt-Mng"}]},
    ]
  };
  let ref = db.ref('plans');
  await ref.set(plans);
};

//#endregion initializing the DB

////////////////////////////////////////////////////////////////////////////////////////////////////
///////  temp stuff, remove later  /////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

//  const f = async () => {
//      await resetToInitialDB();
//  }
//   await setInitialTeams();
//   await setInitialReleases();
//   await setInitialDevsCapacity();
//   await setInitialEpics();



//f();

module.exports = {
  resetToInitialDB,
  getGroups,
  getDevsWithDetails,
  getDevsCapacity,
  getReleases,
  getEpics,
  getPlans,
  setPlans
};
