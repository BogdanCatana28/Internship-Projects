import React, { useState, useEffect, useRef } from 'react';
import './Avatar.css';
import TokenService from '../../services/TokenService';

const Avatar = (props) => {
    const inputRef = useRef(null);
    const [image, setImage] = useState("");
    const user = TokenService.getUser();

    useEffect(() => {
        fetch(`http://localhost:8080/users/${user.id}/get-avatar`)
            .then(response => {
                if (response.status === 200) {
                    return response.blob();
                } else {
                    throw new Error('Avatar not found');
                }
            })
            .then(blob => {
                if (blob.size > 0) {
                    setImage(URL.createObjectURL(blob));
                } else {
                    console.warn('Empty avatar response');
                    setImage("/images/avatar.png");
                }
            })
            .catch(error => {
                setImage("/images/avatar.png");
            });
    }, [user.id]);
    
    const handleImageClick = () => {
        inputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file));
        props.onAvatarChange(file);
    };

    return (
        <>
            <div className="avatar-container">
                <div className="avatar" onClick={handleImageClick}>
                    {image ? (
                        <img
                            src={image}
                            alt=""
                            className="avatar-image"
                        />
                    ) : (
                        <img
                            src="/avatar.png"
                            alt=""
                            className="avatar-image"
                        />
                    )}
                    <input
                        type="file"
                        ref={inputRef}
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                </div>
            </div>
        </>
    );
}

export default Avatar;
