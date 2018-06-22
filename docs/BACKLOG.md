# SpaceMiner Backlog

SpaceMiner takes beginning programmers on an intergalactic journey

# Roles

* `User` -- The most generic, almost useless, category of an actor interacting with SpaceMiner. Generally, avoid using **"As a User"** in stories.
* `Visitor` -- Any User, whether authenticated or not, who is interacting with SpaceMiner.
* `Member` -- A User who has Registered with SpaceMiner and is actively logged in.
* `Author` -- A User who authors lessons / courses within SpacemMiner
* `Admin` -- The User who rules over all and can do anything. The Admin is not quite omnipotent, but aspires to be. 

# Definitions

* `World` -- Members create a World for other Members to explore to collect Gems and Coins (maybe these should actually be minerals or something instead of coins?) for points while fighting off enemies. There will be more to the storyline in later drafts :)
* `Creator` -- Refers to the Member who has created a given World. Members can create as many Worlds as they want.
* `Explorer` -- Refers to a User who explores Worlds invented by Creators
 
# Story Map

We are high-tech in our agile tools here at SpaceMiner in how we track our stories. We use that fancy tracking tool called a Markdown document.

## Key

Unless otherwise prefixed by one of the labels below, consider each bullet point a Story. Indented items are generally less important than their parent, and can be considered "sub stories", unless otherwise noted as `AT`, `D`, or `T`.

* `S` -- A User Story, which should be phrased in terms of a Role type above (almost never `As a User...`)
* `AT` -- Acceptance test
* `D` -- Defect
* `T` -- Task

### Home

* As a Visitor, I can see the most recently Released, Test-Ready, and Under-Development Worlds
	* I can see the total number of worlds in each category
	* I see up to one page-full of worlds in each category (probably about 25 or so)
		* When I scroll down, the site pulls in the next 25 worlds under my cursor or finger swipe

* As a Visitor, I can play Released and Test-Ready Worlds, and I can:
	* See my point total updating as I play
	* See my ammo count increase or decrease as I play
	* See my lives remaining increase or decrease as I play
	* See the World's Creator's name, and I can:
		* Reveal summary info about the World's Creator 
		* Open a new view with detail info about the World's Creator
	* As a Member I can:
		* At any time, Rate the World on a scale of 1 to 5 stars
		* Report a bug to the World's Creator

* As a Visitor, I can filter Release and Test-Ready Worlds by:
	* Highest rating by starred points from players
  	* Most difficult to beat (by duration of average time to beat combined with number of tries it takes an idividual to beat it)
	* As a Member by:  	
		* Never played before
		* Have played before
  		* By those made by people on my friends list
  		* Made by others who have played worlds I made in the past

* As a Visitor I can Register using my account from:
	* Meetup.com
	* GitHub.com
	* Facebook
	* Google
	* Microsoft
	* Or my own email address
		* AT: When I register, I get an email confirmation of my registration

# Profile

TODO

* Members can view their own profile
* Members can view other Member profiles

# Training (Lessons)

This is where Members learn how to program in order to create their worlds

* As a Visitor I can view a list of Training Missions (Lessons) which will help me learn how to create a World by learning JavaScript and the SpaceMiner framework and I can:
	* See how many Trainees have completed each Training Mission
		* Based on Trainee answers to tests within a Training Mission, I can see the:
			* Mean score
			* Median score
			* STD DEV of scores
	* As a Member:
		* For each Training Mission I have already attempted, I can see a Completion Badge that indicates how much of the Mission I have already completed
			* If I have completed 50%, then the badge should be 50% solid and 50% silhouetted, etc.
			* I can see the percentage in text form as well as in the badge form
		 
* As a Visitor I can Open a Training Mission
	* When I open a Mission:
		* As a Visitor: I begin on the first Step of the Mission
		* As a Member: I begin on the Step that I left off last time I opened it
			* Or, if I have already completed the mission, then I see my Mission Summary for the Training Mission
				* And, I can direcrly skip to view a Mission Step 
					* TODO this needs more clarity
		* When I'm on a Mission Step I can see that I'm on Step N/M, such as 1/5
		* If the Mission Step has questions to answer, then only after I answer the questions can I advance to the next Mission Step
		* For Mission Steps after Step 1, I can:
			* Return to First Step
			* Return to Previous Step
		* I can Comment on Mission Steps
		* I can Suggest Edits for the Mission Step by directly editing the Markdown content
			* After I submit the Suggestion:
				* The Mission Authors will get Notified
				* I can see my Suggestions in My Profile
		* When I'm on a Step that I have already completed, then I can:
			* Choose to Reveal my previous Question Attempt Answers
				* NOTE: SpaceMiner should keep a history of all previous attempts.
			* Choose to Reattempt all Step Questions
			* Choose to Reattempt only the Questions I Missed Last Time
			* Choose to Reattempt My Historically Most Challenging Questions
			* Choose to Reattempt the Most Challenging Questions for All Trainees

# Build (Maybe this shoudl be Terraform to evoke the science fiction concept?)

This is where Members create Worlds

# Mission Control

This is where information about what's happening across the galaxy shows up. It's the evoltion of the /dash page.

* Training stats in real time
* World information
* Scoreboard that tallies number of gems and coins 

# Lesson Components

## program component

This component lets a Member read and execute a chunk of code. It should be able to:

### Phase 1
* Execute code, and output results to its own Console area, with functions for:
  * `print(val)` -- Writes `val` to the Console with a new line to the console
  * `printb(val)` -- Writes `val` to the Console but without a new line
* Automatically save each Execution, perhaps even auto-saving in the background.
* Load saved code when a Member navigates back to the step that contains this component instance.
  * Perhaps this should be the responsibility of its container instead of itself. In such a case, it should fire an event when it is destroyed or on interval (for auto-save) for listening containers to observe and do their saving action on.
* Allow for loading the canonical example from the Author
### Phase 2
* Allow loading code from other people who have done this step
* Allow rating and comments on the solution that a particular Member has provided for a challenge step
* Show who is currently on this step
  * Allow interactive chat with those Members
* Allow rating understanding of the code on slider scale


