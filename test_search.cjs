const urls = [
  'http://127.0.0.1:3000/products?title=White%20Gown',
  'http://127.0.0.1:3000/products?title_like=Gown',
  'http://127.0.0.1:3000/products?q=Gown',
  'http://127.0.0.1:3000/products?_q=Gown',
  'http://127.0.0.1:3000/products?title_contains=Gown',
  'http://127.0.0.1:3000/products?title=*Gown*'
];
Promise.all(urls.map(u => fetch(u).then(r=>r.json()).catch(e=>({error: e.message}))))
.then(jsons => {
  jsons.forEach((j, i) => {
    const d = j.data ?? j;
    console.log(urls[i], '=>', Array.isArray(d) ? d.length : 'Not array');
  });
});
