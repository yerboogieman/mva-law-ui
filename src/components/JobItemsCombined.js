import {useEffect, useState} from "react";

const JobItemsCombined = () => {

   const [jobItems, setJobItems] = useState([]);
   const [jobItem, setJobItem] = useState({});



   const handleInputChange = (event) => {
      setJobItem((prevProps) => ({
         ...prevProps,
         [event.target.name]: event.target.value
      }));
   };

   const jobItemsHtml = [];

   function handleSubmit (event)  {

      event.preventDefault();

      jobItems.push(jobItem);
      setJobItems(jobItems)

      for (let item of jobItems) {

         const jobItem = item.item
         const estimatedCost = item.estimatedCost
         const clientId = item.clientId
         const jobComments = item.jobComments

         jobItemsHtml.push(
            <tr>
               <td>{jobItem}</td>
               <td>{estimatedCost}</td>
               <td>{clientId}</td>
               <td>{jobComments}</td>
            </tr>
         )
      }

      console.log(jobItemsHtml)
   }

   return (
      <div>
         <form onSubmit={handleSubmit} className="row g-3 p-0">
            <div className="col-12 input-group-sm">
               <label htmlFor="item" className="form-label">Job Item</label>
               <input
                  type="text"
                  name="item"
                  id="item"
                  value={jobItems.item}
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
                  value={jobItems.estimatedCost}
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
               <label htmlFor="jobComments" className="form-label">Comments</label>
               <textarea
                  name="jobComments"
                  id="jobComments"
                  value={jobItems.jobComments}
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
               {jobItems.map((item) => (
                  <tr>
                     <td>{item.item}</td>
                     <td>{item.estimatedCost}</td>
                     <td>{item.clientId}</td>
                     <td>{item.jobComments}</td>
                  </tr>
               ))}
               </tbody>
            </table>
         </div>
      </div>
   )
}

export default JobItemsCombined