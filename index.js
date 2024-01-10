window.onload = async () => {
  var data;
  await fetch("senators.json")
    .then((item) => item.json())
    .then((data) => {
      const list = document.getElementById("senators");
      const senatorInfo = document.getElementById("senatorInfo");
      const count = document.getElementById("count");
      const democratCount = document.getElementById("democrat-count");
      const republicanCount = document.getElementById("republican-count");
      const independentCount = document.getElementById("independent-count");
      const countP = document.createElement("p");
      const listOfMajorityLeaders = data.objects.filter((senator) => {
        return senator.leadership_title;
      });

      listOfMajorityLeaders.forEach((info) => {
        const leaders = document.createElement("li");
        leaders.classList.add("leaders");
        leaders.innerHTML = `${info.leadership_title}: ${info.person.lastname} ${info.person.firstname} (${info.party})`;
        list.appendChild(leaders);
      });

      let democrats = data.objects.filter((val) => val.party === "Democrat");
      let republicans = data.objects.filter(
        (val) => val.party === "Republican"
      );
      let independent = data.objects.filter(
        (val) => val.party === "Independent"
      );

      {
        let dropdowninfo = '<option value="">show all</option>';
        let optionslist = new Set([]);
        function partylist() {
          for (let i = 0; i < data.objects.length; i++) {
            optionslist.add(data.objects[i].party);
          }
        }
        partylist();
        optionslist.forEach((party) => {
          dropdowninfo += `<option value="${party}">${party}</option>`;
        });
        document.getElementById("party").innerHTML = dropdowninfo;
      }
      {
        let dropdowninfo = '<option value="">show all</option>';
        let ranklist = new Set([]);
        let ranklabellist = new Set([]);
        function Ranklist() {
          for (let i = 0; i < data.objects.length; i++) {
            ranklist.add(data.objects[i].senator_rank_label);
            ranklabellist.add(data.objects[i].senator_rank);
          }
        }
        Ranklist();
        for (var rank of ranklabellist) {
          dropdowninfo += `<option value="${rank}">${rank}</option>`;
        }
        document.getElementById("rank").innerHTML = dropdowninfo;
      }

      {
        let dropdowninfo = '<option value="">show all</option>';
        let stateslist = new Set([]);
        function statelist() {
          for (let i = 0; i < data.objects.length; i++) {
            stateslist.add(data.objects[i].state);
          }
        }
        statelist();
        const sortedstates = Array.from(stateslist).sort();

        sortedstates.forEach((state) => {
          dropdowninfo += `<option value="${state}">${state}</option>`;
        });
        document.getElementById("state").innerHTML = dropdowninfo;
      }
      countP.innerHTML = data.objects.length;
      democratCount.innerHTML = democrats.length;
      republicanCount.innerHTML = republicans.length;
      independentCount.innerHTML = independent.length;
      count.appendChild(countP);
      addDataToUI(data.objects);
      window.data = data.objects;
    });

  const filter = () => {
    let myData = window.data;
    const newData = myData.filter((item) => {
      if (party.value && !(item.party === party.value)) {
        return false;
      }
      if (rank.value && !(rank.value === item.senator_rank)) {
        return false;
      }
      if (state.value && !(state.value === item.state)) {
        return false;
      }
      return true;
    });
    addDataToUI(newData);
  };
  var party = document.getElementById("party");
  var state = document.getElementById("state");
  var rank = document.getElementById("rank");
  party.addEventListener("change", filter);
  state.addEventListener("change", filter);
  rank.addEventListener("change", filter);
};

var element = document.getElementsByClassName("filter");

let filteredData = [];
let searchParam = {};

function viewModal(element, id, data) {
  element.addEventListener("click", () => {
    let val = data.filter((info) => info.phone === id);
    const overlay = document.getElementById("overlay");
    const name = document.createElement("h3");
    const container = document.createElement("div");
    const link1 = document.createElement("div");
    const link2 = document.createElement("div");
    const breakTag = document.createElement("br");
    const office = document.createElement("p");
    const dateOfBirth = document.createElement("p");
    const startDate = document.createElement("p");
    const twitterId = document.createElement("a");
    const youtube = document.createElement("a");
    const website = document.createElement("a");
    name.innerHTML = `Name: ${val[0].person.lastname} ${val[0].person.firstname}`;
    office.innerHTML = `Office: ${val[0].extra.office}`;
    startDate.innerHTML = `Start Day: ${val[0].startdate}`;
    dateOfBirth.innerHTML = `Birthday: ${val[0].person.birthday}`;
    twitterId.href = `https://www.twitter.com/${val[0].person.twitterid || ""}`;
    youtube.href = `https://www.youtube.com/${val[0].person.youtubeid || ""}`;
    twitterId.innerHTML = `Twitter: @${val[0].person.twitterid || ""}`;
    youtube.innerHTML = `Youtube: ${val[0].person.youtubeid || ""}`;
    website.href = `${val[0].website}`;
    website.innerHTML = `Website: ${val[0].website || ""}`;

    twitterId.target = "_blank";
    youtube.target = "_blank";
    website.target = "_blank";

    youtube.appendChild(breakTag);

    link1.appendChild(twitterId);
    link2.appendChild(youtube);

    link1.classList.add("links");
    link2.classList.add("links");

    container.appendChild(name);
    container.appendChild(office);
    container.appendChild(dateOfBirth);
    container.appendChild(startDate);
    // container.appendChild(twitterId);
    // container.appendChild(youtube);
    container.appendChild(website);
    container.appendChild(link1);
    container.appendChild(link2);

    container.classList.add("modal");
    overlay.classList.add("overlay");

    overlay.appendChild(container);
    closeModal(container);
  });
}

function closeModal(modal) {
  const overlay = document.getElementById("overlay");
  overlay.addEventListener("click", (e) => {
    overlay.classList.remove("overlay");
    modal.remove();
  });
}

function addDataToUI(data) {
  let child = document.getElementsByClassName("card");
  if (child.length) {
    if (senatorInfo.hasChildNodes(child)) {
      let childArr = [...child];
      childArr.forEach((node) => {
        senatorInfo.removeChild(node);
      });
    }
  }
  data.forEach((info) => {
    const container = document.createElement("div");
    const name = document.createElement("h3");
    const party = document.createElement("p");
    const state = document.createElement("p");
    const gender = document.createElement("p");
    const rank = document.createElement("p");
    const view = document.createElement("p");
    party.innerHTML = `Party: ${info.party}`;
    state.innerHTML = `State: ${info.state}`;
    gender.innerHTML = `Gender: ${info.person.gender}`;
    rank.innerHTML = `Rank: ${info.senator_rank}`;
    name.innerHTML = `${info.person.lastname} ${info.person.firstname}`;
    view.innerHTML = "View More";

    view.classList.add("view");
    viewModal(view, info.phone, data);

    container.appendChild(name);
    container.appendChild(party);
    container.appendChild(state);
    container.appendChild(gender);
    container.appendChild(rank);
    container.appendChild(view);

    container.classList.add("card");

    senatorInfo.appendChild(container);
  });
}
