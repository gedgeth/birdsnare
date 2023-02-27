function handleSubmit(event) {
    event.preventDefault(); // prevent form submission from reloading the page
    const tweetUrl = document.querySelector('#tweet-form input').value;
    console.log(tweetUrl); // for testing purposes only, remove this later
  }

  const form = document.querySelector('#tweet-form');
  form.addEventListener('submit', handleSubmit);
  