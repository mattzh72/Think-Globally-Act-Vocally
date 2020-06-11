const requiredKeys = {
    name: 1,
    state: 1,
    city: 1,
    resident: 1
};

function verify() {
    // Check name is filled out
    let name = $("#name").val().trim();
    // Check state is selected
    let state = $("#state").val();
    // Check city is selected
    let city = $("#city").val();
    // Check residency
    let resident = $("#resident").is(":checked");
    // Check age
    let age = $("#age").val().trim();

    // OPTIONAL REGIONS
    //Check university
    let university = $("#university").val().trim();

    let validName = name.length > 0;
    let validState = state !== null;
    let validCity = city !== null;
    let validAge = Number.isInteger(Number(age));

    let errors = [];
    if (!validName) {
        errors.push("name");
    }

    if (!validState) {
        errors.push("state");
    }

    if (!validCity) {
        errors.push("city");
    }

    if (!validAge) {
        errors.push("age");
    }

    $("#form-content-wrapper label .error-msg").css("display", "none");
    if (errors.length > 0) {
        errors.forEach(error => {
            $(`label[for="${error}"] .error-msg`).css("display", "block");
        });
        return null;
    }

    let result = {
        name: name,
        state: state,
        city: city,
        resident: resident
    };
    if (age !== "") {
        result.age = age;
    }

    if (university !== "") {
        console.log(university);
        result.university = university;
    }

    return result;
}

function populateEmailPreview(data, template) {
    let body = fillTemplate(data, template);

    let destinations = [];
    Object.values(data.officials).forEach(contact => {
        destinations.push(contact.email);
    });

    $("#success-message span").text(`${data.city}, ${data.state}`);
    $("#mock-email-address").text(destinations.toString().split(",").join(", "));
    $("#mock-email-subject").text(`Re: Demanding Justice in ${data.city}, ${data.state}`);
    $("#mock-email-body").val(body);

    $("#mock-email-address").unbind('click');
    $("#mock-email-address").click(() => {
        $("#mock-email-address").select();
        document.execCommand('copy');
    });

    $("#mock-email-subject").unbind('click');
    $("#mock-email-subject").click(() => {
        $("#mock-email-subject").select();
        document.execCommand('copy');
    });

    $("#mock-email-body").unbind('click');
    $("#mock-email-body").click(() => {
        $("#mock-email-body").select();
        document.execCommand('copy');
    });

    $("#send").unbind('click');
    $("#send").click(() => {
        send(destinations, body);
        $("#send").text("Sent ✓");
    });
}

function fillTemplate(data, template) {
    template = template.replace("<<Location>>", data.city + ", " + data.state);
    template = template.replace("<<Location>>", data.city + ", " + data.state);
    template = template.replace("<<Name>>", data.name);
    template = template.replace("<<Name>>", data.name); // One at the end, this is a dumb solution but whatever
    template = template.replace("<<Age>>", data.age);
    let incidentText = "INCIDENTS:\n";
    data.incidents.forEach(incident => {
        incidentText += `"${incident.name}"\n`;
        incident.links.forEach((link, index) => {
            incidentText += `(${index + 1}) ${link}\n`;
        });
        incidentText += `\n`;
    });
    template = template.replace("<<Incidents>>", incidentText);
    template = template.replace("<<Residency>>",
        data.resident ? 'I am also one of your constituents. ' : "");
    template = template.replace("<<University>>",
        data.university && data.university !== "" ? data.university : "");

    return template;
}

function send(destinations, body) {
    let emailURL = "https://mail.google.com/mail/?view=cm&fs=1" +
        (destinations ? ("&to=" + encodeURIComponent(destinations.toString())) : "") +
        ("&su=" + encodeURI("Demanding Justice in Our Communities")) + ("&body=" + encodeURIComponent(body));

    if (IS_MOBILE) {
        emailURL = "mailto:" +
            (destinations ? (encodeURIComponent(destinations.toString())) : "") +
            ("?subject=" + encodeURI("Demanding Justice in Our Communities")) +
            ("&body=" + encodeURIComponent(body));
    }
    console.log(IS_MOBILE);

    let tempLink = $('<a>', {
        href: emailURL,
        target: "_blank",
        class: "temporary-email-link"
    }).appendTo('body');
    tempLink[0].click();
    tempLink.remove();
}
