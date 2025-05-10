export const getUserDetails = async(userId:string)=>{
    const response = await fetch(`/api/user/userDetails?userId=${userId}`)
    const data = await response.json()
    return data.results[0]
  }
  
  export const getAssets = async(userId:string)=>{
    const response = await fetch(`/api/user/assets?userId=${userId}`)
    // console.log(response)
    const data = await response.json()
    return data
  }
  export const getTransactions = async(userId:string)=>{
    const response = await fetch(`/api/user/transactions?userId=${userId}`)
    const data = await response.json()
    return data.results
}

export const addUser = async (userData:{userId:string,firstName:string,lastName:String,email:string}) => {
    try {
      const response = await fetch(`/api/user/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('User saved:', data);
    } catch (error) {
      console.error('Error sending user data:', error);
    }
  };


