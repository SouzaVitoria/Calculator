class CalcController {
    constructor(){ //Chamado automaticamente quando existe um instancia de uma classe
      this._locale = "pt-BR";
      this._audioOnOff = false;
      this._audio = new Audio('click.mp3');
      this._lastOperator = ''; //atributo quando o botão de igual for clicado mais vezes
      this._lastNumber = ''; //atributo quando o botão de igual for clicado mais vezes
      this._operation = [];
      this._displayCalcEl = document.querySelector("#display");
      this._dateEl = document.querySelector("#data");
      this._timeEl = document.querySelector("#hora");

      this._currentDate;
      this.initialize(); //chamando metodo principal
      this.initButtonsEvents();
      this.getLastOperation();
      this.initKeyboard();
    }

    pasteFromClipboard(){
      document.addEventListener('paste', e=>{
       let text = e.clipboardData.getData('Text'); //Tem que ser o tipo, formato dele, não é necessariamente texto
       this.displayCalc = parseFloat(text);
        console.log(text);
      });
    }

    copyToClipboard(){
      let input = document.createElement('input');
      input.value = this.displayCalc; //Colocar valor dentro do input
      document.body.appendChild(input); //Colocar input na tela
      input.select();
      document.execCommand("Copy");
      input.remove();
    }

    initialize(){ //metodo principal -  quando a calculadora começa ele automaticamente executa

      //colocar ele antes para que quando atualize a pagina a calculadora já inicia com o valor
      this.setLastNumberToDisplay();

      let interval = setInterval(()=>{ //Arrow Function -- FAZER ATUALIZAR A CADA 100
        //Toda vez que cria um setInterval ele cria um id e para conseguirmos para-lo precisamos saber em qual id ele esta por isso a variavel
        this.setDisplayDateTime();
      }, 1000);

                /* setTimeout(() => {
                    clearInterval(interval); //Parar essa variavel 
                  }, 10000); //Depois de 10 segundos pare o interval
                  */
       
      this.pasteFromClipboard();

      document.querySelectorAll('.btn-ac').forEach(btn =>{
        btn.addEventListener('dblclick', e=> {
           this.toggleAudio();
        });
      });
      
    }

    toggleAudio(){
      this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
      if(this._audioOnOff){
        this._audio.currentTime=0; //Audio rápido;
        this._audio.play();
      }else{
        
      }
    }

    addEventListenerAll(element, events, fn){
      // events.split(' '); Para ele colocar um separador nos meu eventos abaixo, coloca o separador em um espaço
      events.split(' ').forEach(event => { //Esta passando em cada evento
        element.addEventListener(event, fn, false); //Pega o elemento e adiciona o evento que esta rodando e a função. 
        //False = Se funcionar no botao ele já para, não funciona na letra. Para o event não disparar duas vezes.
      });
    }

    initKeyboard(){
       document.addEventListener('keyup', e =>{
          this.playAudio();


          switch(e.key){
            case 'Escape':{
              this.clearAll();
              break;
            }
            case 'Backspace':
              this.clearEntry();
              break;
            case '+':
            case '-':
            case '*':
            case '/':
            case '%':
              this.addOperation(e.key);
              break;
            case 'Enter':
            case '=':
             this.calc();
             break;
            case '.':
            case ',':
              this.addDot();
              break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
              this.addOperation(parseInt(e.key));
              break;
            case 'c':
              this.copyToClipboard();
              break;
            
            
          }






       });
    }

    clearAll(){
      this._operation = [];
      this._lastNumber = '';
      this._lastOperator = '';
      this.setLastNumberToDisplay();
    }

    clearEntry(){
      this._operation.pop(); //Tira a ultima informação adicionada ao Array
      this.setLastNumberToDisplay();
    }

    setLastOperation(value){
      this._operation[this._operation.length-1] = value;
    }

    getLastOperation(){
      return this._operation[this._operation.length-1] //length para saber o total de itens - RETORNAR VALOR DO ULTIMO ITEM
    }

    isOperator(value){

     return (['+', '-', '*', '/', '%'].indexOf(value) > -1); 
      /*if(['+', '-', '*', '/', '%'].indexOf(value) > -1){ //indexOf buscar uma das operações dentro do array, se achar tras o index. -1 é quando ele não encontra.
        return true;
      }else{
        return false;
      }*/
    }

    addOperation(value){

     //console.log('TESTE', value, isNaN(this.getLastOperation()));
      
      if(isNaN(this.getLastOperation())){ //Se o ultimo valor digitado não for número;
        //String
        if(this.isOperator(value)){ //Trocar o Operador - TROCAR VALOR DO ULTIMO ITEM
          return this.setLastOperation(value); //Substituição
        } else{ //Se for um número ele add
          this.pushOperation(value);  
          //Atualizar Display
          this.setLastNumberToDisplay();
        }
      }else{ //Se o ultimo valor digitado for número;
        //Number

          if(this.isOperator(value)){ //Trocar o Operador - TROCAR VALOR DO ULTIMO ITEM
            this.pushOperation(value); 
          }else{ //Se for um número ele add
            let newValue = this.getLastOperation().toString() + value.toString();
            this.setLastOperation(parseFloat(newValue)); //Substitui o anterior  

            //Atualizar Display
            this.setLastNumberToDisplay();
          }
      }
    }

    getLastItem(isOperator = true){ //True por padrão - Por padrão trazer o ultimo operador
      let lastItem;
      
      for(let i = this._operation.length - 1; i>=0; i--){ //Achar o ultimo operador

          if(this.isOperator(this._operation[i]) == isOperator){
            lastItem = this._operation[i];
            break;
          }
      }

      if(!lastItem){ //Não encontrou lastItem
        //If ternaário, ? se for igual então, : se não
        lastItem = (isOperator) ? this._lastOperator : this._
      }
      return lastItem;

    }

    setLastNumberToDisplay(){
      let lastNumber = this.getLastItem(false); //Quando é um número
      if(!lastNumber){
        lastNumber = 0;
      }
      this.displayCalc = lastNumber;
    }

    pushOperation(value){
      this._operation.push(value); //Push adiciona informação ao Array 

      if(this._operation.length > 3){ //Verificar se tem mais de 3 valores para fazer o calculo
        
        this.calc(); //Calcular em duplas;
      }else{

      }
    }

    getResult(){
      try{
        return eval(this._operation.join("")); //Join tira o que foi usado como separador 
      }catch(e){
        setTimeout(()=>{ //Se deixar sem quando der erro volta a ser 0 por causa de outros metodos que chamam esse, então mostra o 0 mas em seguida o metodo setError
          this.setError();
        }, 1);
      }
      
    }

    calc(){
      let last = ''; 
      //console.log(this._lastNumber);
      this._lastOperator = this.getLastItem(); //Ver qual foi o ultimo operator e guardar na variavel - atualiza-se aqui

      //Para continuar fazendo calculo quando o = for selecionado
      if(this._operation.length < 3){ //Ver se esta apertando o = antes de colocar os 3 itens, tiver só 2 da erro e se tiver 1 não muda
         let firstItem = this._operation[0];
         this._operation = [firstItem, this._lastOperator, this._lastNumber];
      }

      if(this._operation.length > 3){
        last = this._operation.pop(); //Tirar o ultimo valor digitado para que faça a conta antes
        this._lastNumber = this.getResult(); //Guardando resultado para quando clicar no botão = ele possa fazer novamente
      }else if(this._operation.length == 3){
        this._lastNumber = this.getLastItem(false); //Guardando resultado para quando clicar no botão = ele possa fazer novamente GUARDAR O ULTIMO NUMERO 
      }

        let result = this.getResult();

      if(last == "%"){
        result /= 100;

        this._operation = [result];

      }else{
          this._operation = [result];

          if(last){ //Se last for diferente de vazio
            this._operation.push(last); //Tirar o ultimo valor digitado para que faça a conta antes
          }
  
      }
            //Atualizar Display
            this.setLastNumberToDisplay();
    }

    setError(){
      this.displayCalc = 'Error';
    }

    addDot(){
      let lastOperation = this.getLastOperation();

      if(this.isOperator(lastOperation) || !lastOperation){
        this.pushOperation('0.');
      }else{
        this.setLastOperation(lastOperation.toString() + '.');
      }

      this.setLastNumberToDisplay();
    }

    execBtn(value){
      this.playAudio();
      switch(value){
        case 'ac':{ 
          this.clearAll();
          break;
        }
        case 'ce':
          this.clearEntry();
          break;
        case 'soma':
          this.addOperation("+");
          break;
        case 'subtracao':
          this.addOperation("-");
          break;
        case 'divisao':
          this.addOperation("/");
          break;
        case 'multiplicacao':
          this.addOperation("*");
          break;
        case 'porcento':
          this.addOperation("%");
          break;
        case 'igual':
         this.calc();
         break;
        case 'ponto':
          this.addDot();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          this.addOperation(parseInt(value));
          break;
        default:
          this.setError();
        break; 
      }
    }

    initButtonsEvents(){
      let buttons = document.querySelectorAll("#buttons > g, #parts > g"); // > significa filhos da class buttons - ALL com o normal é que vai trazer todos os elementos.
      
      buttons.forEach((btn, index) =>{ //Para percorrer todos os botões que ele encontrar - Mais de um parametro coloca entre parenteses

        this.addEventListenerAll(btn, 'click drag', e=>{ //Adiciona um evento no botão que esta sendo percorrido(clicado) - THIS...All (Evento criado acima)
          let textBtn = btn.className.baseVal.replace('btn-', ''); //Pegar só nome da classe. Replace - o nome que não quer, substituição.
          this.execBtn(textBtn); 
        });

        this.addEventListenerAll(btn, 'mouseover mousedown mouseup', e=>{
          btn.style.cursor = "pointer"; //mudar cursor do mouse
        });

      });
    }

    setDisplayDateTime(){
      this.displayDate = this.currentDate.toLocaleDateString(this._locale, {day:'2-digit', month:'long', year:'numeric'} );
      this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    
   get displayCalc(){
      return this._displayCalcEl.innerHTML;  
    }
   
    set displayCalc(value){
      if(value.toString().length>10){
        this.setError();
        return false;
      }
     this._displayCalcEl.innerHTML = value;
    
    }

    get displayTime(){
      return this._timeEl.innerHTML;
    }

    set displayTime(value){
      return this._timeEl.innerHTML = value;
    }

    get displayDate(){
      return this._dateEl.innerHTML;
    }

    set displayDate(value){
      return this._dateEl.innerHTML = value;
    }
    
    get currentDate(){
      return new Date();  
    }
   
    set currentDate(value){
      this._currentDate = value;
    }
}