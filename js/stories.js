"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - IMPLEMENTED: showDeleteBtn = false parameter
 * 
 * Returns the markup for the story.
 * - IMPLEMENTED: showDeleteBtn & showStar conditionals inside template literal to show or not to show markup.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);

  // get hostname from story
  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        <div>
          ${showDeleteBtn ? getDeleteBtnHTML() : ""}
          ${showStar ? getStarHTML(story, currentUser) : ""}
          <a href="${story.url}" target="a_blank" class="story-link">
            ${story.title}
          </a>
          <small class="story-hostname">(${hostName})</small><br>
          <small class="story-author">by ${story.author}</small><br>
          <small class="story-user">posted by ${story.username}</small>
        </div>
      </li>
    `);
}

// ** IMPLEMENTED ** 
/** Make delete button HTML for story */
function getDeleteBtnHTML() {
  return `
        <span class="trash-can">
          <i class="fas fa-trash-alt"></i>
        </span>`;
}

// ** IMPLEMENTED **
/** Make favorite/not-favorite star for story */

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
        <span class="star">
          <i class="${starType} fa-star"></i>
        </span>`;
}


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  // console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// ** IMPLEMENTED **
/** Handle deleting a story. */

async function deleteStory(evt) {
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

// ** IMPLEMENTED **
/** Handle submitting submit-form for new story */

async function submitNewStory(evt) {
  // console.debug("submitNewStory");
  evt.preventDefault();

  // get all info from the submit-form
  const author = $("#create-author").val();
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");

}
$submitForm.on("submit", submitNewStory);

// ** IMPLEMENTED **
/******************************************************************************
 * Functionality for list of user's own stories
 */

function putUserStoriesOnPage() {
  // empty the users own stories list
  $ownStories.empty();

  // if the users own stories list is empty,
  // - append "No stories added by user yet!"
  // else 
  // - loop through all of users stories and generate HTML for them
  // show the own stories list
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

// ** IMPLEMENTED **
/******************************************************************************
 * Functionality for favorites list and starr/un-starr a story
 */

/** Put favorites list on page. */

function putFavoritesListOnPage() {
  // empty the users favorited stories list
  $favoritedStoriesList.empty();

  // if user has 0 favorited stroies, append "No favorite stories added!", 
  // else loop through all of user favorites and use generateStoryMarkup(story),
  // and append it to the $favoritedStoriesList
  // then show the favoritedStoriesList
  if (currentUser.favorites.length === 0) {
    $favoritedStoriesList.append("<h5>No favorite stories added!</h5>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStoriesList.append($story);
    }
  }
  $favoritedStoriesList.show();
}

// ** IMPLEMENTED **
/** Handle favorite/un-favorite a story */

async function toggleStoryFavorite(evt) {
  // grab the storyId from the click event
  // find the same story in the stories list from the storyList object by comparing the ids.
  const $target = $(evt.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // if the item is already favorited (checking by presence of star)
  // - currently a favorite: remove from user's fav list and change star
  // - currently not a favorite: add to user's fav list and change star
  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
    putFavoritesListOnPage();
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }

}

$storiesLists.on("click", ".star", toggleStoryFavorite);