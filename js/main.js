console.log('Welcome');

//By default (on page load)

// if a 'firstName' cookie is set,

if (Cookies.get('firstName')){
  alert('Found a cookie named firstName.')
}else {
  alert('No cookie was found.')
}
// Update the DOM to display the value of our firstName cookie

document.getElementById('welcome').innerText = 'welcome back'+ Cookies.get('firstName')
document.getElementById('welcome').value = Cookies.get('firstName');

//Set a cookie with their name in it.
Cookies.set('firstName','Matt');
// on click of #button
document.getElementById('button').addEventListener('click', function(){

// To set the value of a box when the submit button is clicked on.
document.getElementById('test').value = "$250";



  // get the .value of #firstName
  // var fname = document.getElementById('fname').value;
  // Cookies.set('firstName', fname)
});


// store that value in a cookie
