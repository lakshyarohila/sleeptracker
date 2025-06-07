import Guest from "@/component/Guest";
import { currentUser } from "@clerk/nextjs/server";






const Home = async() => {
const user = await currentUser();
if(!user){
 return <Guest/>
  
}
  return (
    <div>page</div>
  )
}

export default Home