const inquirer = require('inquirer');
const fetch = require('node-fetch');
const cTable = require('console.table');
const colors = require('colors/safe');
const Actor = require('./Actor');
const Show = require('./Show');

function fetchShow(value) {
  let searchTerm = value.replace(/\s+/g, '-').toLowerCase();
  let url = `http://api.tvmaze.com/singlesearch/shows?q=${searchTerm}`;
    return fetch(url)
          .then(res => res.json())
          .then(data => buildShow(data))
          .catch(err => console.error("Error: No Show found!"))
}

function fetchActor(value) {
  let searchTerm = value.replace(/\s+/g, '-').toLowerCase();
  let url = `http://api.tvmaze.com/search/people?q=${searchTerm}`;
  name = value;
  return fetch(url)
        .then(res => res.json())
        .then(data => findMatch(data, name))
        .catch(err => console.error("Error: No Actor found!"))
}

function buildShow(obj) {
  let name = obj.name;
  let genre = obj.genres.join(", ")
  let avgRating = obj.rating.average;
  let network = obj.network.name;
  let summary = obj.summary;
  let sho = new Show(name, genre, avgRating, network, summary);
  for (let key in sho) {
    console.log(colors.blue(" | " + key.toUpperCase() + " |"));
    if (typeof sho[key] === "string" ||
        typeof sho[key] === "number") {
      console.log(colors.gray("    " + sho[key]));
    }
  }
}

function findMatch(arr, value) {
  let person = "";
  let match = arr.filter(obj => {
    if (obj.person.name.toLowerCase() == value.toLowerCase()) {
      let name = obj.person.name;
      let bday = obj.person.birthday;
      let gender = obj.person.gender;
      let country = obj.person.country.name;
      let url = obj.person["_links"].self.href;
      person = new Actor(name, bday, gender, country, url);
    }
  })
  for (let key in person) {
    console.log(colors.blue(" | " + key.toUpperCase() + " |"));
    if (typeof person[key] === "string" ||
        typeof person[key] === "number") {
      console.log(colors.gray("    " + person[key]));
    }
  }
  return person;
}

var dialog = () => {
  inquirer.prompt([
    {
      name: "initialSelect",
      message: "Search by show or actor",
      type: "list",
      choices: ["show", "actor"]
    }
  ]).then((answers) => {
      if (answers.initialSelect == "show") {
        inquirer.prompt([
          {
            name: "enterShow",
            message: "Enter a TV Show name",
            type: "input"
          }
        ]).then((answers) => {
            let type = "show";
            let value = answers.enterShow;
            fetchShow(value);
        })
      }

      if (answers.initialSelect == "actor") {
        inquirer.prompt([
          {
            name: "enterActor",
            message: "Enter actor name",
            type: "input"
          }
        ]).then((answers) => {
            let type = "actor";
            let value = answers.enterActor;
            fetchActor(value);
        })
      }
  })
}

dialog();
