let PlayerValue = 1
let case_Input = [0 , 1]
let tableaux = [[0, 1, 0],[0, 0, 0],[0, 0, 0]]
console.log("tableaux", tableaux[case_Input[0]][case_Input[1]])

if (tableaux[case_Input[0]][case_Input[1]] !== 0) {
  console.log("case déjà prise Choisisez-en une autre !");
  // envoyer le mesage à la room
} else {
  tableaux[case_Input[0]][case_Input[1]] == PlayerValue
  // verifier si le joueur a gagné
  // Ligne
  if (tableaux[case_Input[0]][0] == tableaux[case_Input[0]][1] == tableaux[case_Input[0]][2]) {
    console.log("Gagné")
    
  } else if (tableaux[[0][case_Input[1]]] == tableaux[[1][[case_Input[1]]]] == tableaux[[2][[case_Input[1]]]]) {
    console.log("Gagné")

  } else if (case_Input == [1, 1] || case_Input == [0, 0] || case_Input == [2, 2] || case_Input == [0, 2]){
    if (case_Input == [1, 1]) {
      // Check Double Diagonale
      if (case_Input == [0, 0] == case_Input[1, 1] == case_Input[2, 2] || case_Input == [0, 2] == case_Input[1, 1] == case_Input[2, 0]) {
        console.log("Gagné")
      }
    } else if (case_Input == [0, 0]) {
      // Check Diagonale
      if (case_Input == [0, 0] == case_Input[1, 1] == case_Input[2, 2]) {
        console.log("Gagné")
      
      }
    } else if (case_Input == [2, 2]) {
      // Check Diagonale
      if (case_Input == [2, 2] == case_Input[1, 1] == case_Input[0, 0]) {
        console.log("Gagné")
      }
    } else if (case_Input == [0, 2]) {
      // Check Diagonale
      if (case_Input == [0, 2] == case_Input[1, 1] == case_Input[2, 0]) {
        console.log("Gagné")
      }

    }

  } else {
    if(PlayerValue == 1){
      console.log("Player 2")
      PlayerValue = 2
    }else{
      console.log("Player 1")
      PlayerValue = 1
    }
    
    
  }
}
