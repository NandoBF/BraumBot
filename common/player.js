

let inventory = {
	set addItem(itemName, item){
		this.itemName = item;
	}
};



class Player {
	
	constructor(userId, name){
		this.id = userId;
		this.name = name;
		this.inventory = inventory;
		this.points = 0;
	}
	
	give_poro(poro) {
		if(!Object.hasOwn(this, 'poro')){
			this.poro = poro;
		} else {
			console.log('This player already has a Poro')
		}
	}

}
