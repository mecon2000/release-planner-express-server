const initialDb = require("./initial_db.js");
const firebase = require("firebase");
require("firebase/firestore");

let fireBaseDB = null;

const connectToDb = () => {
  firebase.initializeApp({
    apiKey: "AIzaSyA9GWdpSk-eAFYzaYCdsqjNagBnZy6Z9sk",
    authDomain: "releaseplanner-902dc.firebaseapp.com",
    projectId: "releaseplanner-902dc"
  });
  fireBaseDB = firebase.firestore();
};

const getFullDB = async () => {
  let db = await fireBaseDB
    .collection("db")
    .get()
    .then(querySnapshot => {
      if (querySnapshot.size !== 1) {
        throw new Error(
          `expecting to have exactly 1 documnet, but have ${querySnapshot.size}!`
        );
      }
      return querySnapshot.docs[0].data();
    })
    .catch(error => {
      console.error("Error in getDB: ", error);
    });
  return db;
};

const updateFullDB = async newDB => {
  await fireBaseDB
    .collection("db")
    .doc("everything")
    .set(newDB)
    .catch(function(error) {
      console.error("Error in updateDB: ", error);
    });
};

const resetToInitialDB = async () => {
  await fireBaseDB
    .collection("db")
    .doc("everything")
    .set(initialDb)
    .catch(function(error) {
      console.error("Error in resetToInitialDB: ", error);
    });
};

const getTeams = async () => {
  const db = await getFullDB();
  return db.teams.data;
};

const isTeamsEnabledForEditing = async () => {
  const db = await getFullDB();
  return db.teams.enableEditing;
};

const addTeam = async (newTeam, group) => {
  let db = await getFullDB();
  db.teams.data.push({ name: newTeam, group });
  await updateFullDB(db);
};

const getGroups = async () => {
  const db = await getFullDB();
  return db.groups.data;
};

const getCapacityOfDevs = async () => {
  const db = await getFullDB();
  return db.devs.data;
};

const setDevCapacityFor1Week = async (devName, weekNumber, newNumOfDays) => {
  let db = await getFullDB();
  db.devs.data.find(dev => dev.name === devName).capacity[weekNumber] = newNumOfDays;
  await updateFullDB(db);
};

const isDevsCapacityEnabledForEditing = async () => {
  const db = await getFullDB();
  return db.devs.enableEditing;
};

module.exports = {
  connectToDb,
  getFullDB,
  updateFullDB,
  resetToInitialDB,
  
  
  getTeams, //group it belongs to, devs and their skill sets
  isTeamsEnabledForEditing,
  addTeam,  
  getGroups, //
  getCapacityOfDevs,
  setDevCapacityFor1Week,
  isDevsCapacityEnabledForEditing
  /* 
  getReleases
  getDev  (with capacity, skillset, team). can get all devs in a team with param
  getWeekDates
  epics (name, short name, priority, program, efforts for all skillsets, prefered team to implement)
  */

};
