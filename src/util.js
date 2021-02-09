// JavaScript Document
import _ from 'lodash';
export const jsonHeader = {
  'Accept': 'application/json',
  'content-type': 'application/json'
};

export const multipartjsonHeader = {
	'mimeType': 'multipart/form-data'
};


export const tokenHeader = {
  'x-access-token':localStorage.getItem('access_token')
}

export const customFunction = (arg1,arg2) => {

  return arg1+'==='+arg2;

}


/*
  query response helpers:
 */
export const checkStatus = (response) => {
  if (response.status === 200) {
    return response;
  } else if (response.status === 201) {
    return response;
  } else {
    throw response;
    /*
    let error = handleError(response);
    return Promise.reject(error);
    */
  }
};

export const handleError = (response) => {

  let errorMsg = "";
  try{
    return parseJSON(response).then((error)=>{
      if(error.data){
        errorMsg = error.data;
      }else if(_.get(error, "message", false)){
        errorMsg = error.message;
      }else if(_.get(error, "error_message", false)){
        errorMsg = error.error_message
      }else if(_.get(error, "error.message", false)){
        errorMsg = error.error.message;
      }else if(_.get(error, "error.name.error_message", false)){
        errorMsg = error.error.name.error_message;
      }else{
        errorMsg = "There was error in processing your request, Please try again.";
      }
      return errorMsg;
    })
  }
  catch(error){
    errorMsg = "There was error in processing your request, Please try again.";
    return Promise.resolve(errorMsg);
  }
}



export const parseJSON = (response) => {
  return response.json();
};