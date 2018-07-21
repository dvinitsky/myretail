async function getAPIData(id, price, callback) {
  try {
    let response = await fetch(`https://vinitsky-myretail.herokuapp.com/products/${id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'price': price })
      });

    if (response.ok) {
      let jsonResponse = await response.json();
      callback(jsonResponse.value);
      return;
    }
    throw new Error('Request Failed.');
  } catch (error) {
    console.log(error);
  }
}

document.getElementById('submit-button').onclick = () => {
  getAPIData(document.getElementById('id').value, document.getElementById('price').value, response => {
    document.getElementById('update-text').innerHTML = `${response.name} updated with new price: ${response.current_price.value}.`;
  });
}
