/* =========================================
   CO-OP WORK TERM SWITCHER
========================================= */


// Get all sidebar buttons

const coopTerms =
    document.querySelectorAll(".coop-term");


// Get all work-term content sections

const coopContent =
    document.querySelectorAll(".coop-content");


// Add a click event to every work-term button

coopTerms.forEach(function (term) {

    term.addEventListener(
        "click",
        function () {


            // Get the ID of the selected work term

            const selectedTerm =
                this.dataset.term;


            // Remove active state
            // from all sidebar buttons

            coopTerms.forEach(
                function (item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


            // Add active state
            // to the clicked button

            this.classList.add(
                "active"
            );


            // Hide every work-term report

            coopContent.forEach(
                function (content) {

                    content.classList.remove(
                        "active"
                    );

                }
            );


            // Find the selected report

            const selectedContent =
                document.getElementById(
                    selectedTerm
                );


            // Show the selected report

            if (selectedContent) {

                selectedContent.classList.add(
                    "active"
                );

            }

        }
    );

});