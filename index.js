const express = require('express');
const app = express();
const path = require('path');
const pdf = require('html-pdf');
const ejs = require('ejs');
const cors = require('cors');

const stream = require('stream');

app.use(cors());
app.use(express.json());
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.get('/health', (req,res) => {
    return res.json({ message: 'Servidor funcionando normalmente.' })     
 });


 app.post('/pedido', (req,res) => {
    const dados =req.body;
    const nomedoc=dados.nomedoc;
    ejs.renderFile('./public/modelo/index.ejs', dados, (err, html) =>{
     if (err){
         return res.status(500).json({message: 'erro no servidor', err});
     }
     
     const options = {
         format:'A4',
         border:{
             right:'8'
         }
     };
 
     pdf.create(html,options).toBuffer(function (error, buffer) {
         if (error) {
             return res.status(500).json({ message: 'falha ao criar' });
         }

         var fileContents = Buffer.from(buffer, "base64");

         var readStream = new stream.PassThrough();
         readStream.end(fileContents);

         res.set('Content-disposition', 'attachment; filename=' + nomedoc);
         res.set('Content-Type', 'application/pdf');

         readStream.pipe(res);
     })
 
    });
 
 });
 


app.listen(process.env.PORT || 3000);

module.exports = app;