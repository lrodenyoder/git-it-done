var userFormEl = document.getElementById("user-form");
var nameInputEl = document.getElementById("username");
var repoContainerEl = document.getElementById("repos-container");
var repoSearchTerm = document.getElementById("repo-search-term");
var languageButtonsEl = document.getElementById("language-button");


var getUserRepos = function (user) {
    //format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";

    //make a request to the url
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayRepos(data, user);
                });
            } else {
                alert("Error: GitHub User Not Found");
            }
        })
        .catch(function (error) {
            alert("Unable to connect to GitHub");
        });
};

var formSubmitHandler = function (event) {
    event.preventDefault();
    //get value from input getElementById
    var username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub username");
    };
};

var displayRepos = function (repos, searchTerm) {
    //check if api returned any repositories
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repositories found.";
        return;
    }
    //clear old content
    repoContainerEl.textContent = "";
    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        var repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        var repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

        //create span to hold repo name
        var titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //append to child container
        repoEl.appendChild(titleEl);

        //create a status element
        var statusEl = document.createElement("span");
        statusEl.classList = "flex=row align-center";

        //check if current repo has issues r not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fa fa-check-square status-icon icon-success'></i>";
        }

        //append to container
        repoEl.appendChild(statusEl);

        //append container to the DOM
        repoContainerEl.appendChild(repoEl);
    };
};

var getFeaturedRepos = function (language) {
    var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data.items, language);
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
    });
};

//USE THIS TO UPDATE CODE FOR MODULE 5
var buttonClickHandler = function (event) {
    var language = event.target.getAttribute("data-language");
    console.log(language);

    //if the language value != "" or null, pass value through getFeaturedRepos
    if (language) {
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);
languageButtonsEl.addEventListener("click", buttonClickHandler);