
/** 
 * 
 * This function shuffles the elements of an array and returns a new array with the same elements in a different order.
 * 
 * @param array the array to shuffle
 * @returns an array with the same elements as the input array, but in a different order
 */
export function newPosArray(array) {
  const newArray = array.slice(); // Create a copy of the original array
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate random index
    // Swap newArray[i] with newArray[j]
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  // Check if any element remains in its original position
  for (let i = 0; i < array.length; i++) {
    if (array[i] === newArray[i]) {
      // If an element remains in its original position, shuffle again
      return newPosArray(array);
    }
  }
  return newArray;
}
