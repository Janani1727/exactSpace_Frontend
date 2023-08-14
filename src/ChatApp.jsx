import React, { useEffect } from "react";
import "./chat.css";
import axios from "axios";
import { AudioRecorder } from "react-audio-voice-recorder";
import { AiFillLike } from "react-icons/ai";
import EmojiPicker, {
  EmojiStyle,
  Emoji,
  SuggestionMode,
} from "emoji-picker-react";
import { useState } from "react";

import { BsSendFill, BsEmojiSmileFill } from "react-icons/bs";

import {MdDelete} from "react-icons/md"


const ChatApp = () => {
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [showInputField, setShowInputField] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [audioArr, setAudioArr] = useState([]);
  const [displaymsg, setDisplayMsg] = useState([]);
  const [like, setLike] = useState(0);

// to store the audios
  useEffect(() => {
    const storedAudioArr =
      JSON.parse(localStorage.getItem("recordedAudio")) || [];
    setAudioArr(storedAudioArr);
  }, []);

  const handleRecordingComplete = (blob) => {
    storeAudioInLocalStorage(blob);
  };

  function handleInputChange(event) {
    setInputText(event.target.value);
  }
  const storeAudioInLocalStorage = (blob) => {
    const audioBlobUrl = URL.createObjectURL(blob);

    const updatedAudioArr = [...audioArr, audioBlobUrl];
    localStorage.setItem("recordedAudio", JSON.stringify(updatedAudioArr));
    setAudioArr(updatedAudioArr);

  
  };

// for emoji handling

  function onEmojiClick(emojiData, event) {
    setSelectedEmoji(emojiData.unified);
    setShowInputField(true);
    setInputText(
      (prevInputText) =>
        prevInputText + String.fromCodePoint(parseInt(emojiData.unified, 16))
    );
  }

  // this is to fetch the data

  useEffect(() => {
    axios
      .get(`https://lovely-tux-eel.cyclic.app/chat`)
      .then(function (response) {
        setDisplayMsg(response.data);
        
       
      })
      .catch(function (error) {
        console.log("Error:", error.message);
      });
  }, []);

//  this function is to post the message

  const sendPostRequest = () => {
    const data = {
      message: inputText,
    };

   

    axios
      .post("https://lovely-tux-eel.cyclic.app/chat/send", data)
      .then(function (response) {
        
        setInputText("");
        window.location.reload()
      })
      .catch(function (error) {
        console.log("Error:", error.message);
      });
  };

//  this function is to increase the like count
  const handleLike = (id) => {
    axios
      .patch(`https://lovely-tux-eel.cyclic.app/chat/like/${id}`, { $inc: { like: 1 } })
      .then(function (response) {
        setLike(
          displaymsg.map((chat) =>
            chat._id === id ? { ...chat, like: response.data.like } : chat
          )
        )
        window.location.reload()
      })
      .catch(function (error) {
        console.log("Error:", error.message);
      });
  };

// this is to clear the entire chat

  const ClearAll=()=>{
      axios.delete(`https://lovely-tux-eel.cyclic.app/chat/clear`)
      .then(function (response) {
       
        localStorage.removeItem('recordedAudio');
        window.location.reload()
      })
      .catch(function (error) {
        console.log("Error:", error.message);
      });

  }

// this is to clear particular message

  const deleteMsg=(id)=>{
    console.log(id);
    axios.delete(`https://lovely-tux-eel.cyclic.app/chat/delete/${id}`)
    .then(function (response) {
     
      window.location.reload()
    })
    .catch(function (error) {
      console.log("Error:", error.message);
    });

}

   

  return (
    <div>
      <div className="main">
        <div className="sub1">
          <div style={{ display: "flex" }}>
            <div className="logo">
              <img src="https://png.pngtree.com/element_our/png_detail/20181229/vector-chat-icon-png_302635.jpg" alt="" />
            </div>
            <div>
              <div  style={{ marginLeft: "60px",textAlign:"left", marginTop: "1px" ,color:"#2d66c1",fontWeight:"bold"}}>Exact Space Chat App</div>
              <div>
                <p style={{ marginLeft: "60px", marginTop: "7px",textAlign:"left" }}>
                 
                  Group Members: Alan , Bob , Carol , Dean , Eril
                </p>
              </div>
            </div>
            <button  style={{height:"30px",marginLeft:"350px",marginTop:"15px", color:"white",border:"1px solid white", cursor: "pointer",backgroundColor:"rgb(198, 41, 41)"}} onClick={ClearAll}>Clear Chat <MdDelete /></button>
          </div>
        </div>
      
        <div>
          <div className="message-container">
            {displaymsg.map((el, index) => {
              const isAlanOrElin = el.user === "Alan" || el.user === "Elin";
              const messageClass = isAlanOrElin
                ? "message-blue"
                : "message-orange";

                const firstLetter = el.user[0];

              return (
                <>
                <div>
               
                  <div style={{ display: "flex", border: "0px solid black" }}>
                   
                    <div className={messageClass} key={el._id}>
                    <div className="first-letter" style={{fontSize:"22px",color:"white",border:"0px solid black",height:"38px",
                    width:"50px",paddingTop:"10px",textAlign:"center",borderRadius:"50%",fontWeight:"bold",marginLeft:"-80px",backgroundColor:"#8f2841"}}>{firstLetter}</div>
                 
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop:"-50px"
                        }}
                      > 
                    
                        <p style={{ color: "red" }}>{el.user}</p>
                        <p className="sent-time">{el.time}</p>
                      </div>
                      <p>{el.message}</p>

                      <div style= {{display: "flex",
                          justifyContent: "space-between"}}>
                            <div style= {{display: "flex",gap:"20px"
                          }}> 
                            {/* <div style={{marginTop:"3px"}}><BiSolidCommentEdit onClick={()=>editMsg(el._id)} size={"20px"}  /></div> */}
                            <div><MdDelete className="icon" onClick={()=>deleteMsg(el._id)} size={"20px"}/></div>
                            </div>
                        
                        <div
                        
                      >
                        

                        <div 
                        
                        onClick={() => handleLike(el._id)}>
                          <AiFillLike  className="icon" color="orangered"  size={"20px"}/>
                          <span  style={{fontSize:"18px",paddingBottom:"5px",paddingLeft:"2px"}}>{el.like}</span>
                        </div>
                      
                      </div>
                      </div>
                   
                    </div>
                  </div>
                </div>
                 
                </>
              );
            })}

            <div className="recorded-audio-player">
              {audioArr.map((audioUrl, index) => (
                <audio key={index} controls src={audioUrl} className="fixing" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="sendtext">
        <div className="emoji">
          <BsEmojiSmileFill
            size={"50px"}
            className="smiley"
            
            onMouseEnter={() => setIsEmojiPickerOpen(true)}
            onClick={() => setIsEmojiPickerOpen(false)}
          />
          
          {isEmojiPickerOpen && (
            <div className="emoji-picker-container">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                emojiStyle={EmojiStyle.NATIVE}
                suggestedEmojisMode={SuggestionMode.RECENT}
              />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Enter Your Text"
          value={inputText}
          onChange={handleInputChange}
          onClick={() => setIsEmojiPickerOpen(false)}
        />

        <div className="mic">
         
          <AudioRecorder
            onRecordingComplete={handleRecordingComplete}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            downloadOnSavePress={false}
            saveButtonClassName="custom-send-icon"
          />
        </div>

        <div className="send">
          <BsSendFill size={"21px"} onClick={sendPostRequest} />
        </div>
      </div>
    </div>
  );
};

export default ChatApp;




