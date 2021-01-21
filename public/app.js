let app = new Vue({
    el: '#app',
    data: {
        sitename: 'After School Classes',
        task: 'Please select a lesson',
        lessons: [],
        cart:[],
        sortByArray:['subject','location', 'price', 'availableSpaces'],
        selectBy: 'subject',
        orderByArray: ['ascending', 'descending'],
        selectOrder: 'ascending',
        showCartPage: false,
        checkout: {
            name: '',
            number: ''
        },
        showMessage: false,
        placeholder: 'Your Name',
        placeholder2:'Mobile Number'
    },
    methods: {
        addToCart(lesson){
            if(lesson.availableSpaces > 0){
                lesson.availableSpaces--;
                
                let added = false;
                this.cart.forEach(elem => {
                    if(elem.lesson == lesson){
                        added = true;
                        elem.noOfItem++;
                    }
                });

                if(!added){
                    this.cart.push({
                        lesson: lesson,
                        noOfItem: 1
                    });
                }
            }
        },
        anySpacesLeft(lesson){

            if(lesson.availableSpaces <= 0){
                return true;
            } else {
                return false;
            }
        },
        removeElemFromCart(id){
            this.cart[id].lesson.availableSpaces += this.cart[id].noOfItem;
            this.cart.splice(id, 1);
        },
        
        checkoutFinish(){

            this.cart.forEach(item => {

                let body = {
                    "name": this.checkout.name,
                    "phone": this.checkout.number,
                    "lessonID": item.lesson._id,
                    "noOfItem": item.noOfItem
                };
                this.newOrder(body);
                this.updateAvailableSpaces(item);

            });

            this.cart = [];
            this.showMessage = true;
        },
        newOrder(order) {

            fetch('https://individialwork2.herokuapp.com/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            }).then(response => response.json())
            .then(data => { return data }).catch(error => { return data});

        },
        updateAvailableSpaces(item) {

            fetch(`https://individialwork2.herokuapp.com/update/${item.lesson._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    availableSpaces: item.lesson.availableSpaces
                })
            }).then(response => response.json())
            .then(data => { return data }).catch(error => { return data});

        },
        accessLessons(){
            fetch('https://individialwork2.herokuapp.com/lessons')
                .then(response => response.json())
                .then(data => this.lessons = data)
                .catch(error => console.log(error));
        }
    },
    computed:{
        noCartItems() {  
            return this.cart.length;
        },
        cartButtonVisible(){
            if(this.noCartItems <=0){
                return false;
            }else {
                return true;
            }
        },

        sortLessons() {
            let lessonsArray = this.lessons.slice(0); 
            let that = this;
            function compare(a, b) {
                if (a[that.selectBy] > b[that.selectBy]) {
                    return that.selectOrder == 'ascending' ? 1 : -1;
                }
                if (a[that.selectBy] < b[that.selectBy]) {
                    return that.selectOrder == 'ascending' ? -1 : 1;
                }
                return 0; 
            }
            return lessonsArray.sort(compare); 
        },

        getTotalPrice(){
            let total = 0;
            this.cart.forEach(elem => {
                
                total += elem.lesson.price*elem.noOfItem;   
              
            });
            return total;
        },
        validCheckout(){
            let testName= /^[a-zA-Z\s]*$/.test(this.checkout.name);
            let testNumber= /^\d+$/.test(this.checkout.number);

            if (testName && this.checkout.name.length > 0 && testNumber){
                return true;
            }
            return false;
        },
        
    },
    mounted(){
        this.accessLessons();
    }
})