new Vue({

	el:'.contanier',
	data:{

		page1:true,
		page2:false,
		db:null,
		DB_SIZE:5*1024*1024,
		cards:[],
		ID:1,
		question:'',
		answerText:'',
		answerImgUrl:'',
		answerImgInsert:'',
		addCardBtn:'disabled',
		createGroupBtn:'disabled',
		controlId:1,
		cardId:null
	},

	mounted(){
		//Create Database
		this.db = openDatabase('Database','1.0','',this.DB_SIZE)

		//Browser Support Control
		if(this.db) console.log('Created Database')
		else alert('Not Support Browser Version')

		//Create Table
		this.db.transaction((tx)=>{
			//tx.executeSql('DROP TABLE cards')
			tx.executeSql('CREATE TABLE cards (id unique, question,answer)')
		})

		//Get Data
		this.db.transaction((tx)=>{

		tx.executeSql('SELECT * FROM cards',[],(tx,rs)=>{
			for(var i = 0; i<rs.rows.length;i++){
				var row = rs.rows.item(i)
				this.ID = row.id
				this.cardId = i+1
				this.cards.push({
					id:this.ID,
					question:row.question,
					answer:row.answer
				})
			}
		})

		})

	},

	methods:{

		file(e){
			var file = document.querySelector('input[type=file]').files[0];
      		var reader = new FileReader();
      					     		 reader.readAsDataURL(file);   
     		 reader.onload = (e)=>{
		        this.answerImgInsert = e.target.result            
		      };
		},

		addCard(){
			this.cardId++
			//Get Data
			this.db.transaction((tx)=>{

			tx.executeSql('SELECT * FROM cards',[],(tx,rs)=>{
				for(var i = 0; i<rs.rows.length;i++){
					var row = rs.rows.item(i)
					this.ID = row.id
					this.ID++
				}
			})

		})

			//Insert Data
			if(this.answerText && this.answerImgUrl){
				alert('Please Insert Question One Type!!!')
			}
			else if(this.answerText){
				this.db.transaction((tx)=>{
					tx.executeSql('INSERT INTO cards (id,question,answer) VALUES (?,?,?)',[this.ID,this.question,this.answerText])
					this.cards.push({
						id:this.ID,
						question:this.question,
						answer:this.answerText
					})
				})
			}
			else if(this.answerImgUrl){
				this.db.transaction((tx)=>{
					tx.executeSql('INSERT INTO cards (id, question,answer) VALUES (?,?,?)',[this.ID,this.question,this.answerImgUrl])
					this.cards.push({
						id:this.ID,
						question:this.question,
						answer:this.answerImgUrl
					})	
				})
			}
			else if(this.answerImgInsert){
				this.db.transaction((tx)=>{
					tx.executeSql('INSERT INTO cards (id, question,answer) VALUES (?,?,?)',[this.ID,this.question,this.answerImgInsert])
					this.cards.push({
						id:this.ID,
						question:this.question,
						answer:this.answerImgInsert
					})	
				})
			}
		},

		deleteCard(id,index){
			this.db.transaction((tx)=>{
				tx.executeSql('DELETE FROM cards WHERE id=?',[id])
			})
			this.cards.splice(index,1)
			this.cardId--
		},

		next(){

			if(this.controlId < this.cardId){
				this.controlId++
				console.log(this.controlId,this.cardId)
			}
			else{
				this.controlId = this.cardId
			}

		},
		prev(){
			if(this.controlId > 1){
				this.controlId--
				console.log(this.controlId,this.cardId)
			}
			else{
				this.controlId = 1
			}
		},
		createGroup(){
			this.page1 = false
			this.page2 = true
			this.controlId = 1
		},
		prevMenu(){
			this.page1 = true
			this.page2 = false
		},
		shuffle(){
			this.cards.sort(function(a, b){return 0.5 - Math.random()})
			this.controlId = 1
		}
	},

	watch:{

		question(){
			if(this.question && (this.answerText || this.answerImgUrl || this.answerImgInsert)){
				this.addCardBtn = 'active'
			}
			else{
				this.addCardBtn = 'disabled'
			}
		},

		answerText(){
			if(this.question && (this.answerText || this.answerImgUrl || this.answerImgInsert)){
				this.addCardBtn = 'active'
			}
			else{
				this.addCardBtn = 'disabled'
			}
		},

		answerImgUrl(){
			if(this.question && (this.answerText || this.answerImgUrl || this.answerImgInsert)){
				this.addCardBtn = 'active'
			}
			else{
				this.addCardBtn = 'disabled'
			}
		},

		answerImgInsert(){
			if(this.question && (this.answerText || this.answerImgUrl || this.answerImgInsert)){
				this.addCardBtn = 'active'
			}
			else{
				this.addCardBtn = 'disabled'
			}
		},
	
		cards(){
			if(this.cards){
				this.createGroupBtn = 'active'
			}
			else{
				this.createGroupBtn = 'disabled'
				alert()
			}
		}

	}

})