(() => {

    /* =========================================================
       ELECTRIC CURSOR
       ========================================================= */

    if (window.innerWidth <= 768) {
        return;
    }


    /* =========================================================
       CREATE CANVAS
       ========================================================= */

    const canvas = document.createElement("canvas");

    canvas.id = "electric-canvas";

    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9998";

    document.body.appendChild(canvas);


    /* =========================================================
       CREATE CURSOR
       ========================================================= */

    const cursor = document.createElement("div");

    cursor.id = "electric-cursor";

    cursor.style.position = "fixed";
    cursor.style.width = "10px";
    cursor.style.height = "10px";
    cursor.style.borderRadius = "50%";
    cursor.style.background = "#ffffff";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "10000";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.opacity = "0";

    cursor.style.boxShadow =
        "0 0 8px #ffffff, " +
        "0 0 18px #7b61ff, " +
        "0 0 35px #7b61ff";

    document.body.appendChild(cursor);


    const ctx =
        canvas.getContext("2d");


    /* =========================================================
       CANVAS
       ========================================================= */

    let dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    function resizeCanvas() {

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        canvas.width =
            window.innerWidth * dpr;

        canvas.height =
            window.innerHeight * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    resizeCanvas();


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =========================================================
       MOUSE
       ========================================================= */

    const mouse = {

        x: window.innerWidth / 2,
        y: window.innerHeight / 2,

        previousX: window.innerWidth / 2,
        previousY: window.innerHeight / 2,

        speed: 0,

        active: false

    };


    document.addEventListener(
        "mousemove",
        (event) => {

            mouse.previousX =
                mouse.x;

            mouse.previousY =
                mouse.y;

            mouse.x =
                event.clientX;

            mouse.y =
                event.clientY;

            mouse.speed =
                Math.hypot(
                    mouse.x - mouse.previousX,
                    mouse.y - mouse.previousY
                );

            mouse.active = true;

            cursor.style.opacity = "1";

            cursor.style.left =
                mouse.x + "px";

            cursor.style.top =
                mouse.y + "px";

        }
    );


    document.addEventListener(
        "mouseleave",
        () => {

            mouse.active = false;

            cursor.style.opacity = "0";

        }
    );


    /* =========================================================
       FIND NEAREST UI ELEMENT
       ========================================================= */

    function getInteractiveElements() {
        const selectors = [

            /* Actual interactive elements */
            "button",
            "a",
            "input",
            "select",
            "textarea",

            ".btn",

            "[role='button']",
            "[role='link']",
            "[onclick]",

            /* Visual page elements */
            ".card",
            ".project-card",
            ".skill-card",
            ".feature-card",
            ".education-card",
            ".profile-image",

            /* Images */
            "img"

        ];


        const elements = [
            ...document.querySelectorAll(
                selectors.join(",")
            )
        ];


        /*
        * Also detect elements that already
        * use cursor: pointer.
        */

        document
            .querySelectorAll("*")
            .forEach((element) => {

                if (
                    getComputedStyle(element).cursor ===
                    "pointer"
                ) {

                    elements.push(element);

                }

            });


        return [
            ...new Set(elements)
        ].filter(
            (element) => {

                const rect =
                    element.getBoundingClientRect();


                /*
                * Ignore elements that are too
                * large to be useful targets.
                *
                * This prevents the entire page,
                * body, nav, sections, etc. from
                * becoming the target.
                */

                if (
                    rect.width >
                        window.innerWidth * 0.9 &&
                    rect.height >
                        window.innerHeight * 0.5
                ) {

                    return false;

                }


                return (

                    rect.width > 0 &&
                    rect.height > 0 &&

                    rect.bottom > 0 &&
                    rect.right > 0 &&

                    rect.top <
                        window.innerHeight &&
                    rect.left <
                        window.innerWidth

                );

            }
        );

    }


    function findNearestElement() {

        const elements =
            getInteractiveElements();


        let nearest = null;

        let nearestDistance =
            Infinity;


        for (
            const element
            of elements
        ) {

            const rect =
                element.getBoundingClientRect();


            const closestX =
                Math.max(
                    rect.left,
                    Math.min(
                        mouse.x,
                        rect.right
                    )
                );


            const closestY =
                Math.max(
                    rect.top,
                    Math.min(
                        mouse.y,
                        rect.bottom
                    )
                );


            const distance =
                Math.hypot(
                    mouse.x - closestX,
                    mouse.y - closestY
                );


            if (
                distance <
                nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearest =
                    element;

            }

        }


        return {

            element: nearest,

            distance: nearestDistance

        };

    }


    /* =========================================================
       PARTICLES
       ========================================================= */

    const particles = [];


    function spawnParticle(
        x,
        y,
        power = 1
    ) {

        particles.push({

            x,
            y,

            vx:
                (
                    Math.random() - 0.5
                ) *
                (
                    2 +
                    Math.random() * 5
                ) *
                power,

            vy:
                (
                    Math.random() - 0.5
                ) *
                (
                    2 +
                    Math.random() * 5
                ) *
                power,

            life:
                15 +
                Math.random() * 30,

            maxLife: 45,

            size:
                0.5 +
                Math.random() * 2

        });


        if (
            particles.length > 250
        ) {

            particles.splice(
                0,
                particles.length - 250
            );

        }

    }


    function updateParticles() {

        for (
            let i =
                particles.length - 1;

            i >= 0;

            i--
        ) {

            const particle =
                particles[i];


            particle.x +=
                particle.vx;

            particle.y +=
                particle.vy;


            particle.vx *=
                0.95;

            particle.vy *=
                0.95;


            particle.life--;


            if (
                particle.life <= 0
            ) {

                particles.splice(
                    i,
                    1
                );

            }

        }

    }


    function drawParticles() {

        for (
            const particle
            of particles
        ) {

            const alpha =
                particle.life /
                particle.maxLife;


            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                `rgba(220, 210, 255, ${alpha})`;

            ctx.shadowBlur = 12;

            ctx.shadowColor =
                "#7b61ff";

            ctx.fill();

        }


        ctx.shadowBlur = 0;

    }


    /* =========================================================
       LIGHTNING
       ========================================================= */

    function createLightningPoints(
        x1,
        y1,
        x2,
        y2,
        intensity
    ) {

        const distance =
            Math.hypot(
                x2 - x1,
                y2 - y1
            );


        const segments =
            Math.max(
                6,
                Math.floor(
                    distance / 11
                )
            );


        const points = [

            {
                x: x1,
                y: y1
            }

        ];


        const dx =
            x2 - x1;

        const dy =
            y2 - y1;


        const normalX =
            -dy /
            Math.max(
                distance,
                1
            );


        const normalY =
            dx /
            Math.max(
                distance,
                1
            );


        for (
            let i = 1;
            i < segments;
            i++
        ) {

            const progress =
                i / segments;


            const falloff =
                Math.sin(
                    progress * Math.PI
                );


            const displacement =
                (
                    Math.random() - 0.5
                ) *
                55 *
                intensity *
                falloff;


            points.push({

                x:
                    x1 +
                    dx * progress +
                    normalX * displacement,

                y:
                    y1 +
                    dy * progress +
                    normalY * displacement

            });

        }


        points.push({

            x: x2,
            y: y2

        });


        return points;

    }


    function drawLightning(
        x1,
        y1,
        x2,
        y2,
        intensity = 1
    ) {

        const points =
            createLightningPoints(
                x1,
                y1,
                x2,
                y2,
                intensity
            );


        /* Glow */

        ctx.beginPath();

        ctx.moveTo(
            points[0].x,
            points[0].y
        );


        for (
            let i = 1;
            i < points.length;
            i++
        ) {

            ctx.lineTo(
                points[i].x,
                points[i].y
            );

        }


        ctx.strokeStyle =
            "rgba(123, 97, 255, 0.28)";

        ctx.lineWidth =
            8 * intensity;

        ctx.shadowBlur = 30;

        ctx.shadowColor =
            "#7b61ff";

        ctx.stroke();


        /* Purple bolt */

        ctx.beginPath();

        ctx.moveTo(
            points[0].x,
            points[0].y
        );


        for (
            let i = 1;
            i < points.length;
            i++
        ) {

            ctx.lineTo(
                points[i].x,
                points[i].y
            );

        }


        ctx.strokeStyle =
            "rgba(160, 130, 255, 0.95)";

        ctx.lineWidth =
            2 * intensity;

        ctx.shadowBlur = 16;

        ctx.shadowColor =
            "#7b61ff";

        ctx.stroke();


        /* White core */

        ctx.beginPath();

        ctx.moveTo(
            points[0].x,
            points[0].y
        );


        for (
            let i = 1;
            i < points.length;
            i++
        ) {

            ctx.lineTo(
                points[i].x,
                points[i].y
            );

        }


        ctx.strokeStyle =
            "rgba(250, 248, 255, 0.95)";

        ctx.lineWidth =
            0.75 * intensity;

        ctx.shadowBlur = 8;

        ctx.shadowColor =
            "#ffffff";

        ctx.stroke();


        ctx.shadowBlur = 0;


        /* Sparks */

        for (
            let i = 1;
            i < points.length - 1;
            i += 3
        ) {

            if (
                Math.random() < 0.3
            ) {

                spawnParticle(
                    points[i].x,
                    points[i].y,
                    0.45
                );

            }

        }

    }


    /* =========================================================
       ELEMENT EDGE
       ========================================================= */

    function getElementEdgePoint(
        element
    ) {

        const rect =
            element.getBoundingClientRect();


        const side =
            Math.floor(
                Math.random() * 4
            );


        if (side === 0) {

            return {

                x:
                    rect.left +
                    Math.random() *
                    rect.width,

                y:
                    rect.top

            };

        }


        if (side === 1) {

            return {

                x:
                    rect.right,

                y:
                    rect.top +
                    Math.random() *
                    rect.height

            };

        }


        if (side === 2) {

            return {

                x:
                    rect.left +
                    Math.random() *
                    rect.width,

                y:
                    rect.bottom

            };

        }


        return {

            x:
                rect.left,

            y:
                rect.top +
                Math.random() *
                rect.height

        };

    }


    /* =========================================================
       ARC TO NEAREST ELEMENT
       ========================================================= */

    let arcTimer = 0;


    function drawNearestArc() {

        const result =
            findNearestElement();


        if (
            !result.element ||
            result.distance > 450
        ) {

            return;

        }


        const strength =
            Math.max(
                0.5,
                1.5 -
                result.distance / 350
            );


        if (
            arcTimer <= 0
        ) {

            const target =
                getElementEdgePoint(
                    result.element
                );


            drawLightning(

                mouse.x,
                mouse.y,

                target.x,
                target.y,

                strength

            );


            if (
                Math.random() < 0.65
            ) {

                const branch =
                    getElementEdgePoint(
                        result.element
                    );


                drawLightning(

                    mouse.x,
                    mouse.y,

                    branch.x,
                    branch.y,

                    strength * 0.55

                );

            }


            arcTimer =
                result.distance < 100
                    ? 2
                    : result.distance < 220
                        ? 4
                        : 7;

        }


        arcTimer--;

    }


    /* =========================================================
       CURSOR ELECTRICITY
       ========================================================= */

    function drawCursorElectricity() {

        const count =
            mouse.speed > 12
                ? 4
                : 2;


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const start =
                3 +
                Math.random() * 5;


            const end =
                18 +
                Math.random() * 30;


            drawLightning(

                mouse.x +
                    Math.cos(angle) * start,

                mouse.y +
                    Math.sin(angle) * start,

                mouse.x +
                    Math.cos(angle) * end,

                mouse.y +
                    Math.sin(angle) * end,

                0.4 +
                Math.random() * 0.3

            );

        }

    }


    /* =========================================================
       CLICK EFFECT
       ========================================================= */

    document.addEventListener(
        "click",
        (event) => {

            const x =
                event.clientX;

            const y =
                event.clientY;


            /* Central sparks */

            for (
                let i = 0;
                i < 75;
                i++
            ) {

                spawnParticle(
                    x,
                    y,
                    2.5
                );

            }


            /* Radial dispersion */

            for (
                let i = 0;
                i < 18;
                i++
            ) {

                const angle =
                    Math.PI * 2 *
                    (i / 18) +
                    (
                        Math.random() - 0.5
                    ) *
                    0.25;


                const distance =
                    60 +
                    Math.random() * 140;


                drawLightning(

                    x,
                    y,

                    x +
                        Math.cos(angle) *
                        distance,

                    y +
                        Math.sin(angle) *
                        distance,

                    1.4 +
                    Math.random() * 0.8

                );

            }


            /* Extra arcs */

            for (
                let i = 0;
                i < 8;
                i++
            ) {

                const angle =
                    Math.random() *
                    Math.PI *
                    2;


                const distance =
                    20 +
                    Math.random() * 70;


                drawLightning(

                    x,
                    y,

                    x +
                        Math.cos(angle) *
                        distance,

                    y +
                        Math.sin(angle) *
                        distance,

                    0.8 +
                    Math.random() * 0.7

                );

            }


            /* Cursor pulse */

            cursor.style.transform =
                "translate(-50%, -50%) scale(3)";

            cursor.style.boxShadow =
                "0 0 10px #ffffff, " +
                "0 0 25px #7b61ff, " +
                "0 0 55px #7b61ff, " +
                "0 0 90px #7b61ff";


            setTimeout(
                () => {

                    cursor.style.transform =
                        "translate(-50%, -50%) scale(1)";

                    cursor.style.boxShadow =
                        "0 0 8px #ffffff, " +
                        "0 0 18px #7b61ff, " +
                        "0 0 35px #7b61ff";

                },
                220
            );

        }
    );


    /* =========================================================
       ANIMATION
       ========================================================= */

    function animate() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        if (
            mouse.active
        ) {

            drawNearestArc();

            drawCursorElectricity();

        }


        updateParticles();

        drawParticles();


        requestAnimationFrame(
            animate
        );

    }


    animate();

})();