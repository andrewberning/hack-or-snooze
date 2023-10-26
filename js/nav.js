"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  // console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  // console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  // console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

// ** IMPLEMENTED **
/** Show story submit form on click "submit" */

function navSubmitStoryClick(evt) {
  // console.debug("navSubmitStoryClick", evt);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.slideDown("slow");
}

$navSubmitStory.on("click", navSubmitStoryClick);

// ** IMPLEMENTED **
/** Show favorite stories on click on "favorites" */

function navFavoritesClick(evt) {
  hidePageComponents();
  putFavoritesListOnPage();
}

$body.on("click", "#nav-favorites", navFavoritesClick);

// ** IMPLEMENTED **
/** Show My Stories on clicking "my stories" */

function navMyStories(evt) {
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);

// ** IMPLEMENTED **
/** Hide everything but profile on click on "profile" */

function navProfileClick(evt) {
  hidePageComponents();
  $userProfile.show();
}

$body.on("click", "#nav-user-profile", navProfileClick);