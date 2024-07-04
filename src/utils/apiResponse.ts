export class Apiresponse {
    statuscode :number;
    data :any;
    success : boolean;
    message :string;

    constructor(
        statuscode : number,
        data :any,
        message :"success",
    )

    {
    
    this.statuscode = statuscode;
    this.data = data ;
    this.message =message;
    this.success = statuscode <400
}

}



