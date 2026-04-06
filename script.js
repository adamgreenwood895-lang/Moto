let listening = false;
let recognition;

// ===== JOB FLOW STATE =====
let jobFlow = {
    active: false,
    step: null,
    data: {}
};

// ===== MAIN TAP =====
function handleTap() {
    const glow = document.getElementById("glow");
    const output = document.getElementById("output");

    if (!("webkitSpeechRecognition" in window)) {
        alert("Speech recognition not supported");
        return;
    }

    if (!listening) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            listening = true;
            glow.classList.add("active");

            output.textContent = "Listening...";
            output.classList.add("active", "listening");
        };

        recognition.onresult = (event) => {
            const text = event.results[0][0].transcript.toLowerCase();

            console.log("User said:", text);

            handleVoice(text);
        };

        recognition.onend = () => {
            listening = false;
            glow.classList.remove("active");
        };

        recognition.start();

    } else {
        recognition.stop();
        listening = false;
        glow.classList.remove("active");
    }
}

// ===== VOICE ENGINE =====
function handleVoice(text) {
    const output = document.getElementById("output");

    // ===== JOB CREATION FLOW =====
    if (jobFlow.active) {

        if (jobFlow.step === "name") {
            jobFlow.data.customer = text;
            jobFlow.step = "bike";

            speak("Bike make and model?");
            return;
        }

        if (jobFlow.step === "bike") {
            jobFlow.data.bike = text;
            jobFlow.step = "job";

            speak("Brief job description?");
            return;
        }

        if (jobFlow.step === "job") {
            jobFlow.data.description = text;

            // CREATE JOB
            const reference = `${jobFlow.data.customer} ${jobFlow.data.bike}`;

            let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

            jobs.push({
                id: Date.now(),
                reference: reference,
                description: jobFlow.data.description,
                status: "New"
            });

            localStorage.setItem("jobs", JSON.stringify(jobs));

            speak(`Job created under ${reference}`);

            // RESET FLOW
            jobFlow = { active: false, step: null, data: {} };

            // OPTIONAL: go to dashboard after 1.5s
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1500);

            return;
        }
    }

    // ===== START JOB CREATION =====
    if (
        text.includes("job") &&
        (text.includes("create") ||
         text.includes("add") ||
         text.includes("book") ||
         text.includes("new"))
    ) {
        jobFlow.active = true;
        jobFlow.step = "name";
        jobFlow.data = {};

        speak("Customer name?");
        return;
    }

    // ===== UPDATE JOB =====
    if (text.includes("update")) {

        let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
        let found = false;

        jobs = jobs.map(job => {
            const ref = job.reference.toLowerCase();

            if (text.includes(ref)) {
                found = true;

                let newDesc = text
                    .replace("update", "")
                    .replace(ref, "")
                    .trim();

                job.description = newDesc || job.description;
                job.status = "Updated";
            }

            return job;
        });

        localStorage.setItem("jobs", JSON.stringify(jobs));

        if (found) {
            speak("Job updated");
        } else {
            speak("Job not found");
        }

        return;
    }

    // ===== OPEN DASHBOARD =====
    if (
        text.includes("dashboard") ||
        text.includes("check job") ||
        text.includes("customer job")
    ) {
        speak("Opening dashboard");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

        return;
    }

    // ===== FALLBACK =====
    speak("Command not recognised");
}

// ===== UI OUTPUT =====
function speak(message) {
    const output = document.getElementById("output");

    output.textContent = message;
    output.classList.remove("listening");
    output.classList.add("active");

    // fade out after delay
    setTimeout(() => {
        output.classList.remove("active");
    }, 2500);
}
