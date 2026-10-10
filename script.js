// API endpoint
const apiUrl = "https://clinicaltrials.gov/api/v2/studies";

// Get HTML elements
const searchForm=document.getElementById("searchForm");
const searchInput=document.getElementById("searchInput");
const trialsContainer=document.getElementById("trialsContainer");
const loadingMessage=document.getElementById("loadingMessage");
const errorMessage=document.getElementById("errorMessage");

// Fetch clinical trials
async function fetchTrials(condition="diabetes"){
    loadingMessage.textContent="Loading clinical trials...";
    errorMessage.textContent="";
    trialsContainer.innerHTML="";

    try{
        const response = await fetch(
            `${apiUrl}?query.cond=${encodeURIComponent(condition)}&pageSize=6&format=json`
        );

        if(!response.ok){
            throw new Error("Failed to fetch clinical trials");
        }

        const data = await response.json();
        loadingMessage.textContent = "";

        // Check whether trials are available
        if(!data.studies || data.studies.length === 0){
            errorMessage.textContent = "No clinical trials found. Try another condition.";
            return;
        }

        // Display clinical trial cards
        data.studies.forEach((study)=>{
            const details = study.protocolSection;
            const title = details.identificationModule.briefTitle;
            const id = details.identificationModule.nctId;
            const status = details.statusModule.overallStatus;

            trialsContainer.innerHTML += `
                <div class="trial-card">
                    <h2>${title}</h2>
                    <p><strong>Study ID:</strong> ${id}</p>
                    <p><strong>Status:</strong> ${status}</p>
                    <a href="https://clinicaltrials.gov/study/${id}"
                       target="_blank" rel="noopener noreferrer">
                        View Study
                    </a>
                </div>
            `;
        });

    } catch(error){
        console.error("Error fetching trials:", error);
        loadingMessage.textContent = "";
        errorMessage.textContent = "Unable to load trials. Please try again.";
    }
}

// Handle search form submission
searchForm.addEventListener("submit",(event)=>{
    event.preventDefault();

    const condition = searchInput.value.trim();

    if(condition===""){
        errorMessage.textContent = "Please enter a health condition.";
        return;
    }

    fetchTrials(condition);
});

// Display diabetes trials when the page opens
fetchTrials();

