class Palindrome {
  constructor(word){
      this._word = word;
  }

  // Getter methods
  get word() {
      return this._word;
  }

  // Setter method
  set word(value) {
      this._word = value;
  }

  // Method gets value from the DOM
  valueFromDom(id) {
      return document.querySelector(id).value
  }


  // Method uses fetch to make a request
  async checkPalindrome() {
      try {
          const response = await fetch(`api`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'userWord': this._word
            })
          })


          const data = await response.json()
          console.log(data)

          // Place result in the DOM
          if(data.palindrome == false) {
              document.querySelector('#result').innerText = `${this._word} is not a palindrome`
          }else {
              document.querySelector('#result').innerText = `${this._word} is a palindrome`
            setTimeout(function() {
                location = ''
            }, 4000)
          }
  
      } catch (error) {
          console.log(error)
      }
  }
}

document.querySelector('#btn').addEventListener('click', () => {

  // Create an instance of the class Palindrome
  const palindrome = new Palindrome()

  //get the value from the input
  let userValue = palindrome.valueFromDom('#input')

  // Set the value in the Class
  palindrome.word = userValue

  // Call the fetch
  palindrome.checkPalindrome()
  
})

// Delete words
const deleteWord = document.getElementsByClassName('fa-solid') // Creates a node list

// Convert nodeList to an array and add eventLisiner to all trash cans
Array.from(deleteWord).forEach(element => {
  element.addEventListener('click', deletePerson)
})

// Method will be used to remove a word from the DataBase
async function deletePerson() {
    let userWord = this.parentNode.parentNode.childNodes[1].innerText // Get the inner text from the clicked trash can. With the HTML DOM, you can navigate the node tree using node relationships.
    // this means look at the element i clicked and get me this location. The DOM structor is a tree

    try{
        const response = await fetch('deleteEntry', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'word' : userWord // Send the innerText of the clicked trash can. Should have a charactername to delete
            })
        })
        const data = await response.json()
        location.reload()
        
    } catch(err) {
        console.log(err)
    }
}