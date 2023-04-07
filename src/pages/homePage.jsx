import React, { useState, useEffect } from 'react'
import { bookSlot, getSlots, deleteSlots } from '../service/api'
import './style.css'
import { Modal, TextField, MenuItem, Button, Grid } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Toast = ({ type, message, onClose }) => {
  let bgColor = '';
  let textColor = '';

  if (type === 'error') {
    bgColor = 'bg-red-600';
    textColor = 'text-white';
  } else if (type === 'success') {
    bgColor = 'bg-green-500';
    textColor = 'text-white';
  }

  return (
    <div style={{ zIndex: 1001 }} className={`absolute top-0 right-0 mt-10 mr-2 py-2 px-4 rounded-md shadow-md ${bgColor} ${textColor}`}>
      <p>{message}</p>
    </div>
  );
};


function HomePage() {
  const [slots, setSlots] = useState([]);
  const [showToast, setShowToast] = useState(null);

  const { loggedIn, user } = useSelector(state => state.user)
  const navigate = useNavigate()
  useEffect(() => {
    if (!loggedIn) {
      navigate('/login')
    }
  }, [loggedIn])


  const handleShowToast = (type, message) => {
    setShowToast({ type, message });
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };


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
      handleShowToast('error', 'Please fill all the fields')
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
          handleShowToast('success', res?.message)
        }
        else {
          handleShowToast('error', res?.message)
        }
      })
      .catch(err => {
        handleShowToast('error', err?.response?.data?.message?.details ? err?.response?.data?.message?.details[0]?.message : err?.response?.data?.message)
        console.log('Error:', err); // Update with your own error handling logic
      })
      .finally(() => {
        // Reset loading state
        setLoading(false);
      });
  };

  const deleteSlotsFun = (id) => {
    deleteSlots(id).then(res => {
      if (res?.status) {
        handleShowToast('success', res?.message)
        getSlotsFun()
        handleModalClose()
      }
      else {
        handleShowToast('error', res?.message)
      }
    })
      .catch(err => {
        handleShowToast('error', err?.response?.data?.message?.details ? err?.response?.data?.message?.details[0]?.message : err?.response?.data?.message)
        console.log('Error:', err); // Update with your own error handling logic
      })
      .finally(() => {
        // Reset loading state
        setLoading(false);
      });
  }

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
      {showToast && (
        <Toast type={showToast.type} message={showToast.message} onClose={() => setShowToast(null)} />
      )}
      <div class="h-screen flex flex-col justify-center items-center mt-2">
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
          <Button variant="outlined" color="primary" className="border-primary text-primary hover:bg-primary hover:text-primary" 
          style={{
            marginLeft:'10px'
          }}>

            Clear
          </Button>
        </div>


        <div className="parking-lot-container w-90 h-90">
          <div className='relative'>
            <img
              src="https://cdn.reliance-foundry.com/media/20220610214611/parking-lot-spaces.jpg"
              alt="Parking Lot"
              className="object-contain md:object-cover m-auto w-full h-full"
            />
            <div className="flex w-full flex-wrap " style={{ position: 'absolute', top: 0 }}>

              <div className="flex " style={{
                marginTop: '75px',
                width: '60vw',
                marginLeft: 'auto'

              }}>

                <div className="mr-4">
                  <ul className="flex flex-wrap" >
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
                          }} key={slot.slotNumber} className="flex  items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

                <div className="mr-4" style={{ marginLeft: '30px' }}>
                  <ul className="flex flex-wrap" >
                    {slots.map(slot => (
                      <>
                        {slot?.slotNumber > 26 && slot?.slotNumber <= 26 + 32 && (
                          <li onClick={() => {
                            if (slot?.booked) {
                              setupdateModalData(slot)
                              setIsOpen(true)
                            }
                            else {
                              setSlotNumber(slot?.slotNumber)
                              setOpen(true)
                            }
                          }} key={slot.slotNumber} className="flex items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

              </div>

              <div className="flex " style={{
                marginTop: '90px',
                marginLeft: 'auto',
                width: '56vw'
              }}>

                <div className="mr-4" style={{
                  width: '34vw',
                  marginRight: '3vw'
                }}>
                  <ul className="flex flex-wrap" >
                    {slots.map(slot => (
                      <>
                        {slot?.slotNumber > (26 + 32) && slot?.slotNumber <= (26 + 32 + 22) && (
                          <li onClick={() => {
                            if (slot?.booked) {
                              setupdateModalData(slot)
                              setIsOpen(true)
                            }
                            else {
                              setSlotNumber(slot?.slotNumber)
                              setOpen(true)
                            }
                          }} key={slot.slotNumber} className="flex  items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

                <div style={{
                  width: '42vw',
                  marginRight: '66px'
                }}>
                  <ul className="flex flex-wrap" >
                    {slots.map(slot => (
                      <>
                        {slot?.slotNumber > (26 + 32 + 22) && slot?.slotNumber <= (26 + 32 + 23 + 27) && (
                          <li onClick={() => {
                            if (slot?.booked) {
                              setupdateModalData(slot)
                              setIsOpen(true)
                            }
                            else {
                              setSlotNumber(slot?.slotNumber)
                              setOpen(true)
                            }
                          }} key={slot.slotNumber} className="flex items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

              </div>


              <div className="flex " style={{
                marginTop: '90px',
                marginLeft: 'auto',
                width: '52vw'
              }}>

                <div className="mr-4" style={{
                  width: '32vw',
                  marginRight: '3vw'
                }}>
                  <ul className="flex flex-wrap" >
                    {slots.map(slot => (
                      <>
                        {slot?.slotNumber > (108) && slot?.slotNumber <= (108 + 18) && (
                          <li onClick={() => {
                            if (slot?.booked) {
                              setupdateModalData(slot)
                              setIsOpen(true)
                            }
                            else {
                              setSlotNumber(slot?.slotNumber)
                              setOpen(true)
                            }
                          }} key={slot.slotNumber} className="flex  items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

                <div style={{
                  width: '50vw',
                  marginRight: '52px'
                }}>
                  <ul className="flex flex-wrap" >
                    {slots.map(slot => (
                      <>
                        {slot?.slotNumber > (126) && slot?.slotNumber <= (126 + 28) && (
                          <li onClick={() => {
                            if (slot?.booked) {
                              setupdateModalData(slot)
                              setIsOpen(true)
                            }
                            else {
                              setSlotNumber(slot?.slotNumber)
                              setOpen(true)
                            }
                          }} key={slot.slotNumber} className="flex items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

              </div>


              <div className="flex " style={{
                marginTop: '98px',
                marginLeft: 'auto',
                width: '49vw'
              }}>

                <div className="mr-4" style={{
                  width: '23vw',
                  marginRight: '3vw'
                }}>
                  <ul className="flex flex-wrap" >
                    {slots.map(slot => (
                      <>
                        {slot?.slotNumber > (154) && slot?.slotNumber <= (154 + 14) && (
                          <li onClick={() => {
                            if (slot?.booked) {
                              setupdateModalData(slot)
                              setIsOpen(true)
                            }
                            else {
                              setSlotNumber(slot?.slotNumber)
                              setOpen(true)
                            }
                          }} key={slot.slotNumber} className="flex  items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

                <div style={{
                  width: '38vw',
                  marginRight: '86px'
                }}>
                  <ul className="flex flex-wrap" >
                    {slots.map(slot => (
                      <>
                        {slot?.slotNumber > (168) && slot?.slotNumber <= (168 + 22) && (
                          <li onClick={() => {
                            if (slot?.booked) {
                              setupdateModalData(slot)
                              setIsOpen(true)
                            }
                            else {
                              setSlotNumber(slot?.slotNumber)
                              setOpen(true)
                            }
                          }} key={slot.slotNumber} className="flex items-center mb-2" style={{
                            padding: '.4rem'
                          }}>
                            <span
                              className={`w-2 h-2 rounded-full mr-1 cursor-pointer ${slot.booked ? "bg-green-500" : "bg-red-500"
                                }`}
                            />
                          </li>
                        )}
                      </>
                    ))}
                  </ul>
                </div>

              </div>

            </div>
          </div>


        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center"
        style={{ width: window.innerWidth < 767 ? '80vw' : '50vw', maxWidth: '700px', margin: 'auto', marginTop: '10vh' }}
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
          <div className="flex justify-end mt-10">
            {formData?.user === user?.userData?._id ? <Button variant="contained" color="primary" onClick={() => deleteSlotsFun(formData?._id)} className="mt-4">
              Cancel booking
            </Button> : null}
            <Button style={{ marginLeft: '5px' }} variant="contained" color="primary" onClick={handleModalClose} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>

  )
}

export default HomePage