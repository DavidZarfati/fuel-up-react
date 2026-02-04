// // import { useEffect, useState } from "react"
// // import axios from "axios"
// // import { useGlobal } from "../context/GlobalContext";
// // import { useNavigate } from "react-router-dom";

// // export default function Productpagedetail () {
    


// //     // const [product, setProduct] = useState()
// //     // const {slug} = useParams();
// //     // const {backendUrl} = useGlobal();
// //     // const navigate = useNavigate();

// //     // useEffect(()=>{
// //     //     getProduct();
// //     // },[slug]);

// //     // function getProduct(){
// //     //     axios.get(`${backendUrl}/api/products/${slug}`)
// //     //     .then((resp)=> {
// //     //         setProduct(resp.data)
// //     //         console.log(resp.data)
// //     //     })
// //     //     .catch((err)=>{
// //     //         console.log(err);
// //     //     })

// //     // }
// //     // function goBack(event) {
// //     //     event.preventDefault();
// //     //     navigate(-1);
// //     // }
// //    

// //     return(
// //         <>
// //         {Product.map((card, index)=>{
// //             return(
// //                 <>
// //                 <section >
// //                 <h1>{card.title}</h1>
// //                 <p>{card.description}</p>
// //                 </section>
// //                 </>
// //             )
// //         })}



// //         </>
// //     )

// // }

// import { useParams } from "react-router-dom";

// export default function Productpagedetail() {
//   const { slug } = useParams();

//   const arrayTestCard = [
//     {
//       title: "casein vanilla serving",
//       slug: "casein-vanilla-serving",
//       image: "../assets/testimages/image/casein-vanilla-serving.jpg",
//       description: "una porzione di proteine casearie alla vanilla",
//       categories: "protein,integration,natural"
//     },
//     {
//       title: "beta alanine scoop",
//       slug: "beta-alanine-scoop",
//       image: "../assets/testimages/image/beta-alanine-scoop.jpg",
//       description: "uno scoop di beta alanina",
//       categories: "protein,integration,science"
//     }
//   ];

//   const product = arrayTestCard.find(p => p.slug === slug);

//   if (!product) {
//     return <h2>Prodotto non trovato</h2>;
//   }

//   return (
//     <section>
//       <h1>{product.title}</h1>
//       <p>{product.description}</p>
//     </section>
//   );
// }
