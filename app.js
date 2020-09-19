const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


mongoose.connect("mongodb://localhost:27017/coronaDB", ({ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }));



const patientSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    createdAt: String,
    symtoms: Array
});

const Patient = mongoose.model("Patient", patientSchema);

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get("/contact", function(req, res) {
    res.sendFile(__dirname + "/contact.html");
});

app.get("/survivor", function(req, res) {
    res.sendFile(__dirname + "/post.html");
});


app.post("/about", function(req, res) {
    console.log(req.body);

    const array = {
        createdAt: Date.now(),
        temp: req.body.temp,
        Oxy: req.body.Oxy,
        difficultyInBreathing: req.body.difficultyInBreathing,
        ChestPain: req.body.ChestPain,
        LossOfSpeech: req.body.LossOfSpeech,
        Fever: req.body.Fever,
        DryCough: req.body.DryCough,
        Tiredness: req.body.Tiredness,
        BodyAchesandPain: req.body.BodyAchesandPain,
        SoreThroat: req.body.SoreThroat,
        Diarrhea: req.body.Diarrhea,
        Headache: req.body.Headache,
        LossOfTasteOrSmell: req.body.LossOfTasteOrSmell,
        RashOnSkinOrDiscolourationOfFingersOrToes: req.body.RashOnSkinOrDiscolourationOfFingersOrToes,
        Conjuctivitis: req.body.Conjuctivitis
    }

    const p = new Patient({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    });

    console.log("array is " + JSON.stringify(array));
    p.symtoms.push(array);

    Patient.findOne({ email: req.body.email }, function(err, patient) {
        if (!err) {
            if (patient) {
                console.log("patient is " + patient.symtoms[0]);
                const length = patient.symtoms.length;
                if (Date.now() - patient.symtoms[length - 1].createdAt >= 86400000) {
                    patient.symtoms.push(array);
                } else {
                    patient.symtoms[length - 1] = array;
                }
            } else {
                p.save();
            }
        }


    });

    res.redirect("/result/" + req.body.email);

});

app.get("/result/:email", function(req, res) {

    Patient.findOne({ email: req.params.email }, function(err, patient) {
        if (!err) {
            if (patient) {
                var score = 0;
                const symtom = patient.symtoms[patient.symtoms.length - 1];

                console.log("symtom are " + JSON.stringify(symtom));

                var part1 = 0;
                var part2 = 0;

                console.log(symtom.difficultyInBreathing);
                if (symtom.difficultyInBreathing == "Yes") {
                    console.log("1");
                    part1 += 10;
                }

                console.log(symtom.DryCough);
                if (symtom.DryCough == "Yes") {
                    console.log("1");
                    part1 += 10;
                }

                console.log(symtom.temp);
                if (parseInt(symtom.temp) >= 99.4 && parseInt(symtom.temp) < 102) {
                    console.log("1");
                    part1 += 4;
                }


                if (parseInt(symtom.temp) >= 102 && parseInt(symtom.temp) < 104) {
                    console.log("1");
                    part1 += 8;
                }


                if (parseInt(symtom.temp) >= 104) {
                    console.log("1");
                    part1 += 10;
                }


                console.log(symtom.Headache);
                if (symtom.Headache == "Yes") {
                    console.log("1");
                    part2 += 5;
                }

                console.log(symtom.Tiredness);
                if (symtom.Tiredness == "Yes") {
                    console.log("1");
                    part2 += 5;
                }


                console.log(symtom.difficultyInBreathing);
                if (symtom.Diarrhea == "Yes") {
                    console.log("1");
                    part2 += 5;
                }

                console.log(symtom.difficultyInBreathing);
                if (symtom.ChestPain == "Yes") {
                    console.log("1");
                    part2 += 5;
                }

                console.log(symtom.difficultyInBreathing);
                if (symtom.SoreThroat == "Yes") {
                    console.log("1");
                    part2 += 5;
                }
                score = 2.5 * part1 + 1 * part2;
                console.log("Score is " + score);

                res.render("result", { score: score, symtom: symtom, patient: patient });
            }
        }
    });

});


app.listen("3000", function() {
    console.log("port 3000 has started");
});
