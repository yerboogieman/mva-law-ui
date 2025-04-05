import {useEffect, useState} from "react";

const CaseItemsCombined = () => {

   const [caseItems, setCaseItems] = useState([]);
   const [caseItem, setCaseItem] = useState({});

   const handleInputChange = (event) => {
      setCaseItem((prevProps) => ({
         ...prevProps,
         [event.target.name]: event.target.value
      }));
   };

   const caseItemsHtml = [];

   function handleSubmit (event)  {
      event.preventDefault();

      caseItems.push(caseItem);
      setCaseItems(caseItems)

      for (let item of caseItems) {
         const caseItem = item.item
         const estimatedCost = item.estimatedCost
         const clientId = item.clientId
         const caseComments = item.caseComments

         caseItemsHtml.push(
            <tr>
               <td>{caseItem}</td>
               <td>{estimatedCost}</td>
               <td>{clientId}</td>
               <td>{caseComments}</td>
            </tr>
         )
      }

      console.log(caseItemsHtml)
   }

   return (
      <div>
         <form onSubmit={handleSubmit} className="row g-3 p-0">
            <div className="col-12 input-group-sm">
               <label htmlFor="item" className="form-label">Case Item</label>
               <input
                  type="text"
                  name="item"
                  id="item"
                  value={caseItems.item}
                  onChange={handleInputChange}
                  className="form-control"
               />
            </div>
            <div className="col-md-6 input-group-sm">
               <label htmlFor="estimatedCost" className="form-label">Estimated Cost</label>
               <input
                  type="text"
                  name="estimatedCost"
                  id="estimatedCost"
                  value={caseItems.estimatedCost}
                  onChange={handleInputChange}
                  className="form-control"
               />
            </div>
            <div className="col-md-6 input-group-sm">
               <label htmlFor="clientId" className="form-label">Client</label>
               <select id="clientId" name="clientId" onChange={handleInputChange} className="form-select">
                  <option defaultValue="Joe">Joe</option>
                  <option value="Frank">Frank</option>
                  <option value="Bill">Bill</option>
               </select>
            </div>
            <div className="col-md-12 input-group-sm">
               <label htmlFor="caseComments" className="form-label">Comments</label>
               <textarea
                  name="caseComments"
                  id="caseComments"
                  value={caseItems.caseComments}
                  onChange={handleInputChange}
                  className="form-control">
               </textarea>
            </div>
            <div className="col-12 input-group-sm">
               <button type="submit" className="btn btn-primary float-end">Sign in</button>
            </div>
         </form>
         <div>
            <table border={1}>
               <thead>
               <tr>
                  <th>Item</th>
                  <th>Estimated Cost</th>
                  <th>Client ID</th>
                  <th>Comments</th>
               </tr>
               </thead>
               <tbody>
               {caseItems.map((item) => (
                  <tr>
                     <td>{item.item}</td>
                     <td>{item.estimatedCost}</td>
                     <td>{item.clientId}</td>
                     <td>{item.caseComments}</td>
                  </tr>
               ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}

export default CaseItemsCombined 