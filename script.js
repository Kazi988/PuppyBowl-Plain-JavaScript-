const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = '2302-ACC-CT-WEB-PT-A';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

//This grabs from another JS file for DOM styling
const main = () => {
    const main = import("./style.js");
    return main;
}

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    const PLAYERS = "players";
    try {
        const response = await fetch(`${APIURL}/${PLAYERS}`)
        const result = await response.json();
        // console.log(result);
        return result.data.players;

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`)
        const player = await response.json();
        // console.log(player.data);
        return player.data;
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => { // GET /api/COHORT-NAME/players/]
    try {
        const response = await fetch(`${APIURL}/players`, {
            method: "POST",
            body: JSON.stringify(playerObj),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        window.location.reload();
        return result;
    } catch (err) {
        console.error("Oops, something went wrong with adding that player!", err);
    }
};

const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/players/${playerId}`,
            {
                method: 'DELETE',
            });
        const result = await response.json();
        window.location.reload();
        return result;

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    try {
        if (!playerList || playerList.length === 0) {
            playerContainer.innerHTML = "<h3>NO PLAYERS FOUND!</h3>";
            return;
        }
        playerContainer.innerHTML = "";

        playerList.forEach((player) => {
            const playerElement = document.createElement("div");
            playerElement.classList.add("player-card");

            playerElement.innerHTML = `<h4>${player.name}</h4>
                                        <img src ="${player.imageUrl}" alt ="${player.name}"
                                        <p>${player.breed}</p>
                                        <button class="detail-button" data-id="${player.id}">See Details</button>
                                        <button class="delete-button" data-id="${player.id}">Remove</button>`;

            playerContainer.appendChild(playerElement);

            let deleteButton = playerElement.querySelector(".delete-button");
            deleteButton.addEventListener("click", (event) => {
                event.preventDefault();
                removePlayer(player.id);
            });
            let detailButton = playerElement.querySelector(".detail-button");
            detailButton.addEventListener("click", (event) => {
                event.preventDefault();
                renderSinglePlayer(player);
            });
        });
    } catch (err) {

        console.error(err);

    }
};

// render single player
const renderSinglePlayer = (playerId) => {
    if (!playerId || !playerId.id) {
        playerContainer.innerHTML = "<h3>Couldn't find data for this player!</h3>";
        return;
    }

    let playerDetailsHTML = `
    <div class="single-player-card">
        <div class="header-info">
            <p class="puppy-name">${playerId.name}</p>
            <p class="puppy-idNumber">#${playerId.id}</p>
        </div>
        <div class="player-detail">
            <p>Team: ${playerId.team ? playerId.team.name : playerId.teamId}</p>
            <p>Breed: ${playerId.breed}</p>
            <p>Status: ${playerId.status}</p>
        </div>
            <img src="${playerId.imageUrl}" alt="photo of ${playerId.name} the puppy">
        <button id="see-all">Back to all players</button>
    </div>
    `;
    playerContainer.innerHTML = playerDetailsHTML;

    let seeAllButton = document.getElementById('see-all');
    seeAllButton.addEventListener('click', async () => {
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
    });
}

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    let formHtml = `
        <form>
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" placeholder="Enter Name" />

            <label for="breed">Breed:</label>
            <input type="text" id="breed" name="breed" placeholder="Enter Breed" />

            <label for="status">Status:</label>
            <select name="status" id="status">
            <option value="field">Field</option>
            <option value="bench">Bench</option></select>

            <label for="imageUrl">Image URL:</label>
            <input type="text" id="imageUrl" name="imageUrl" placeholder="Enter Image URL"/>

            <label for="teamId">Team:</label>
            <input type="number" id="team" name="team" placeholder="Enter team" />

            <button id="submit-button" type="submit">Submit</button>
        </form>    
    `;
    newPlayerFormContainer.innerHTML = formHtml;


    let form = newPlayerFormContainer.querySelector('form');
    try {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            let playersData = {
                name: form.name.value,
                breed: form.breed.value,
                status: form.status.value,
                imageUrl: form.imageUrl.value,
                teamId: form.team.value,

            };
            //console.log(playersData)
            await addNewPlayer(playersData);

            const player = await fetchAllPlayers();
            renderAllPlayers(player);

            form.name.value = '';
            form.breed.value = '';
            form.status.value = '';
            form.imageUrl.value = '';
            form.team.value = '';

        })

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}


const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    // await removePlayer(6213);
    renderNewPlayerForm();
}
main();
init();