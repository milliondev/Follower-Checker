const firstInput = document.getElementById('followingInput');
        const secondInput = document.getElementById('followerInput');
        const firstStep = document.getElementById("step-1");
        const secondStep = document.getElementById("step-2");

        const traitorInfo = document.getElementById('traitor-info');
        const previewText = document.getElementById('preview-text');

        let errors = 0;
        let traitorsShown = false;
        let validFirstInput = '';
        let validSecondInput = '';
        const output = document.getElementById('output');

        const followingList = [];
        const followersList = [];
        let matchedUsers = [];
        let notFollowingBack = [];
        let traitorContainer = document.getElementById('traitors');


        firstInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    if (checkForError("following") == true){
                        errors--;
                        removeError("following");
                    }
                    const followingJSON = JSON.parse(e.target.result);
                    followingJSON.relationships_following.forEach((item) => {
                        followingList.push(item.string_list_data[0].value);

                    });

                } catch (error) {
                    errors++;
                    if (checkForError("following") == false){
                        showError("following", firstStep, "following");
                    }
                    // validFirstInput = false;
                    // alert("There was an error getting the JSON from the file");
                }
            };
            console.log(followingList);
            reader.readAsText(file);
        });

        secondInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    if (checkForError("follower") == true){
                        errors--;
                        removeError("follower");
                    }
                    const followersJSON = JSON.parse(e.target.result);
                    followersJSON.forEach((item) => {
                        followersList.push(item.string_list_data[0].value);
                    });

                } catch (error) {
                    validSecondInput = false;
                    errors++;
                    if (checkForError("follower") == false){
                        showError("followers_1", secondStep, "follower");
                    }
                }
            };
            console.log(followersList);
            reader.readAsText(file);
        });

        function checkForError(step){
            let element = document.getElementById(`${step}-error`);
            if (element){
                console.log("error exists");
                return true;
            } else {
                console.log("error does not exist");
                return false;
            }
        }

        function showError(fileName, element, step){
            console.log("CREATING ERROR");
            let errorMessage = document.createElement("div");
            errorMessage.setAttribute("class","error");
            errorMessage.setAttribute("id", `${step}-error`);
            let errorText = document.createElement("h5");
            errorText.innerHTML = `<strong>ERROR:</strong><br>The file you uploaded doesn't match Instagram's ${step} file format. Please make sure you've uploaded the correct file. It should be named <strong>${fileName}.json`
            errorMessage.appendChild(errorText);
            element.appendChild(errorMessage);
        }

        function removeError(errorType) {
            console.log("removing error");
            let element = document.getElementById(`${errorType}-error`);
            element.classList.add("hidden");
            setTimeout(() => {
                element.remove();
            }, 1500);
        }


        function crosscheck() {
            if (secondInput.value == '' || firstInput.value == '' || errors > 0){
                alert("Please upload your JSON files first!");
            } else {
                for (let i = 0; i < followingList.length; i++) {
                notFollowingBack.push(followingList[i]);
            }
            for (let i = 0; i < followingList.length; i++) {
                for (let j = 0; j < followersList.length; j++) {
                    if (followingList[i] == followersList[j]) {
                        matchedUsers.push(followingList[i]);
                        // console.log(followingList[i] + " FOLLOWS YOU BACK!");
                    }
                }
            }
            notFollowingBack = followingList.filter(item => !matchedUsers.includes(item));
            console.log(notFollowingBack);
            if (traitorsShown != true){
                showTraitors();
            }
            
            }
        }

        function showTraitors() {
            console.log(document.getElementById("traitorCount"));
            if (document.getElementById("traitorCount")) {
                console.log("found an existing heading with the traitor count, removing it");
                document.getElementById("traitorCount").remove();
            }
            previewText.remove();
            let traitorCount = document.createElement("h2");
            traitorCount.setAttribute("id", "traitorCount");
            traitorCount.innerHTML = `${notFollowingBack.length} Accounts do NOT Follow You Back`;
            traitorInfo.appendChild(traitorCount);

            for (let i = 0; i < notFollowingBack.length; i++) {
                console.log("creating element");
                let traitor = document.createElement("a");
                traitor.setAttribute("href", `https://instagram.com/${notFollowingBack[i]}`);
                traitor.setAttribute("target", `_blank`);
                traitor.className = "traitor";
                traitor.innerHTML = `@${notFollowingBack[i]}`;
                traitorContainer.appendChild(traitor);
            }

            traitorsShown = true;

        }