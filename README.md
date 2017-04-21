# Study Controller
A drop-in solution for running online psychological studies.

## What does it do exactly?
Basically, the Study Controller handles the [executive function] of a psychological study. It takes in a description of the study to run (a "ConditionObject" in the code), presents the study to the participant, validates and records the participants' answers, and stores the collected data. In its current form, it's best suited for studies in which there are a large number of similar, repetitive tasks which have right and wrong answers, like word unscambling tasks, for example.

The Study Controller has a few other optional bells and whistles that are baked in, including a countdown timer that starts and stops between each trial and a progress bar that updates after each trial. In the future, I want to figure out a way to remove these kinds of specifics from the Study Controller itself, while also making the Study Controller more extensible so that it can support these kinds of study-specific needs.

## How does it work?
The central Study Controller communicates with two other classes: the User Interface Adapter, which handles the display of the study (usually in a browser), and the Participant Data Service, which handles the data collected through the course of the study.

Unlike the Study Controller, which should change very little, the User Interface Adapter and Participant Data Service need to be tailored for each study. For example, imagine a study in which participants rate a series of images, where the study is being run in a lab on a locally hosted webpage. In that case, the Participant Data Service needs to be written to display the images it gets from the to read the participants' responses from the radio buttons and report them to the Study Controller, and the Participant Data Service needs to be written to get the study information (i.e., the images store the participants' data to the local database.
