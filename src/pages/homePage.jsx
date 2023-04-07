import React, { useState, useEffect } from 'react'
import { bookSlot, getSlots } from '../service/api'
import { DatePicker, Space } from 'antd';
import './style.css'
import { Modal, TextField, MenuItem, Button, Grid } from '@material-ui/core';

function HomePage() {
  const [slots, setSlots] = useState([]);

  const getSlotsFun = (start, end) => {
    const obj = {}
    if (start)
      obj.startDate = start
    if (end)
      obj.endDate = end
    getSlots(obj)
      .then(res => {
        const slotNumbers = res.data.map(slot => slot.slotNumber);

        const updatedSlots = Array.from({ length: 200 }, (_, i) => {
          const slotData = res.data.find(item => item.slotNumber === i + 1) || {};
          return { slotNumber: i + 1, booked: slotNumbers.includes(i + 1), ...slotData };
        });
        setSlots(updatedSlots);
        console.log("updatedSlots", updatedSlots)


      })
      .catch(error => {
        console.error("Error fetching slots:", error);
      });
  }

  const { RangePicker } = DatePicker;
  const onChange = (value, dateString) => {
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
  };
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    let dateOfParkingISO, endDateOfParkingISO;
    if (startDate)
      dateOfParkingISO = new Date(startDate)?.toISOString();
    if (endDate)
      endDateOfParkingISO = new Date(endDate)?.toISOString();

    console.log("startDate", dateOfParkingISO)
    console.log("endDate", endDateOfParkingISO)
    getSlotsFun(dateOfParkingISO, endDateOfParkingISO)
  }, [startDate, endDate])

  //MODAL

  const [open, setOpen] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [dateOfParking, setDateOfParking] = useState(null);
  const [endDateOfParking, setEndDateOfParking] = useState(null);
  const [vehicleNo, setVehicleNo] = useState('');
  const [slotNumber, setSlotNumber] = useState('');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false); // Add loading state

  // Handle Form Submit
  const handleSubmit = () => {
    const dateOfParkingISO = new Date(dateOfParking).toISOString();
    const endDateOfParkingISO = new Date(endDateOfParking).toISOString();
    const formDataObj = {
      vehicleType,
      dateOfParking: dateOfParkingISO,
      endDateOfParking: endDateOfParkingISO,
      vehicleNo,
      slotNumber
    };
    console.log("formData", formDataObj);

    if (!formDataObj.vehicleType || !formDataObj.dateOfParking || !formDataObj.endDateOfParking || !formDataObj.vehicleNo || !formDataObj.slotNumber) {
      console.log('Error: Please fill in all fields'); // Update with your own error handling logic
      return;
    }

    // Set loading state
    setLoading(true);

    // Call API to book slot
    bookSlot(formDataObj)
      .then(res => {
        if (res?.status) {
          console.log('API response:', res);
          setVehicleType('');
          setDateOfParking(null);
          setEndDateOfParking(null);
          setVehicleNo('');
          setSlotNumber('');
          handleClose();
          getSlotsFun()
        }
      })
      .catch(err => {
        console.log('Error:', err); // Update with your own error handling logic
      })
      .finally(() => {
        // Reset loading state
        setLoading(false);
      });
  };


  //MODAL SHOW
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    vehicleType: '',
    dateOfParking: '',
    endDateOfParking: '',
    vehicleNo: '',
    slotNumber: ''
  });

  const [updateModalData, setupdateModalData] = useState(null)
  // Update form data onChange
  useEffect(() => {
    if (updateModalData)
      setFormData({ ...formData, ...updateModalData })
  }, [updateModalData])


  // Handle Modal Open
  const handleModalOpen = () => {
    setIsOpen(true);
  };

  // Handle Modal Close
  const handleModalClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div class="h-screen flex flex-col justify-center items-center mt-20">
        <div className="flex justify-center items-center h-full mt-10">
          <div className="w-96">
            <TextField
              label="Select date"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              variant="outlined"
              className="mb-4"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ placeholder: 'dd/mm/yyyy hh:mm' }}
            />
          </div>
        </div>

        <div style={{ padding: '10px', margin: '10px', marginTop: '50px' }}>
          <img src="https://cdn.reliance-foundry.com/media/20220610214611/parking-lot-spaces.jpg" alt="Parking Lot" className="w-full h-full object-cover" />
        </div>
        <div className="flex" style={{ padding: '2vh', margin: '2vh', marginTop: '5vh' }}>
          <div className="mr-4">
            <ul className="flex flex-wrap" style={{ position: 'absolute', top: '18vh', width: '26vw', left: '22vw' }}>
              {slots.map(slot => (
                <>
                  {slot?.slotNumber <= 26 && (
                    <li onClick={() => {
                      if (slot?.booked) {
                        setupdateModalData(slot)
                        setIsOpen(true)
                      }
                      else {
                        setSlotNumber(slot?.slotNumber)
                        setOpen(true)
                      }
                    }} key={slot.slotNumber} className="flex p-1 items-center mb-2">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${slot.booked ? "bg-green-500" : "bg-red-500"
                          }`}
                      />
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
          <div className="mr-4">
            <ul className="flex flex-wrap" style={{ position: 'absolute', top: '18vh', width: '32vw', left: '50vw' }}>
              {slots.map(slot => (
                <>
                  {slot?.slotNumber > 26 && slot?.slotNumber <= 26 + 32 && (
                    <li key={slot.slotNumber} className="flex p-1 items-center mb-2">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${slot.booked ? "bg-green-500" : "bg-red-500"
                          }`}
                      />
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
        </div>


        <div className="flex">
          <div className="mr-4">
            <ul className="flex flex-wrap">
              {slots.map(slot => (
                <>
                  {slot?.slotNumber > 26 + 32 && slot?.slotNumber <= 26 + 32 + 22 && (
                    <li key={slot.slotNumber} className="flex items-center mb-2">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${slot.booked ? "bg-green-500" : "bg-red-500"
                          }`}
                      />
                      {slot.slotNumber}
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
          <div>
            <ul className="flex flex-wrap">
              {slots.map(slot => (
                <>
                  {slot?.slotNumber > 26 + 32 + 22 && slot?.slotNumber <= 26 + 32 + 22 + 20 && (
                    <li key={slot.slotNumber} className="flex items-center mb-2">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${slot.booked ? "bg-green-500" : "bg-red-500"
                          }`}
                      />
                      {slot.slotNumber}
                    </li>
                  )}
                </>
              ))}
            </ul>
          </div>
        </div>

      </div>
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center"
        style={{ width: window.innerWidth < 767 ? '80vw' : '50vw', maxWidth: '700px', margin: 'auto' }}
      >
        <div className="w-full bg-white border border-gray-300 rounded-lg p-8 max-w-md">
          <h1 className="text-2xl font-semibold mb-6">Add Parking Details</h1>
          <form>
            <TextField
              select
              label="Vehicle Type"
              value={vehicleType}
              onChange={(e) => {
                console.log(e.target.value)
                setVehicleType(e.target.value)
              }}
              fullWidth
              variant="outlined"
              className="mb-4"
              margin="normal"
            >
              <MenuItem value="car">Car</MenuItem>
              <MenuItem value="bike">Bike</MenuItem>
              <MenuItem value="truck">Truck</MenuItem>
            </TextField>
            <TextField
              label="Date of Parking"
              type="datetime-local"
              value={dateOfParking}
              onChange={(e) => setDateOfParking(e.target.value)}
              fullWidth
              variant="outlined"
              className="mb-4"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ placeholder: 'dd/mm/yyyy hh:mm' }}
            />
            <TextField
              label="End Date of Parking"
              type="datetime-local"
              value={endDateOfParking}
              onChange={(e) => setEndDateOfParking(e.target.value)}
              fullWidth
              variant="outlined"
              className="mb-4"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ placeholder: 'dd/mm/yyyy hh:mm' }}
            />
            <TextField
              label="Vehicle No"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              fullWidth
              variant="outlined"
              className="mb-4"
              margin="normal"
            />
            <TextField
              disabled
              label="Slot Number"
              value={slotNumber}
              onChange={(e) => setSlotNumber(e.target.value)}
              fullWidth
              variant="outlined"
              className="mb-4"
              margin="normal"
            />
            <div className="flex justify-end mt-6">
              <Button variant="outlined" color="primary" onClick={handleClose} className="mr-2">
                Cancel
              </Button>
              <Button disabled={loading ? true : false} variant="contained" color="primary" onClick={handleSubmit} style={{ marginLeft: '5px' }} className="ml-2">
                {loading ? "Loading..." : "save"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <Modal
        open={isOpen}
        onClose={handleModalClose}
        className="flex justify-center items-center"
        style={{ height: '40vh', maxWidth: '700px', margin: 'auto' }}

      >
        {/* Modal Content */}
        <div className="bg-white p-8 rounded-lg flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Parking details</h2>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Vehicle Type:</span> {formData.vehicleType}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Date of Parking:</span>{' '}
              {formData.dateOfParking ? new Date(formData.dateOfParking).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }) : ''}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">End Date of Parking:</span>{' '}
              {formData.endDateOfParking ? new Date(formData.endDateOfParking).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              }) : ''}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Vehicle No:</span> {formData.vehicleNo}
            </p>
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">Slot Number:</span> {formData.slotNumber}
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="contained" color="primary" onClick={handleModalClose} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>

  )
}

export default HomePage