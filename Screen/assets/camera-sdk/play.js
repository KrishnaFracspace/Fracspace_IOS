
let SearchRecList = [] //playback Recording list
let playerList = [] //player list
let sessionList = [] //connection objects list
/**
  * ConnectApi p2p connection control object, receive p2p callback data by configuring callback method
  *
  * kp2pPlayer player constructor, pass in the canvas element to create the player
  * Parameter 1 canvas is the canvas used to display the screen
  * Parameter 2 can be directly specified as false
  * Parameter 3 is used for the context of the callback, starting from 0, and adding 1 for each creation
  */
const Player = {};
/**
* Get device connection status based on device ID
* @method GetSessionById
* @param {string} devid device ID
*
* return
* @return {object} session connection state object
*/
function GetSessionById(devid) {
	for (let i = 0; i < sessionList.length; i++) {
		if (sessionList[i].deviceid == devid) {
			return sessionList[i];
		}

	}
	return null;
}
/**
  * Get device connection status based on device ip
  * @method GetSessionByIp
  * @param {string} ip device ip
  *
  * return
  * @return {object} session connection state object
  */
function GetSessionByIp(ip) {
	for (let i = 0; i < sessionList.length; i++) {
		if (sessionList[i].ip == ip) {
			return sessionList[i];
		}

	}
	return null;
}
/**
  *
  * Get device connection status based on form index
  * @method GetSessionByWinindex
  * @param {number} winindex window index
  *
  * return
  * @return {object} session connection state object
  */
function GetSessionByWinindex(winindex) {
	for (let i = 0; i < sessionList.length; i++) {
		for (let j = 0; j < sessionList[i].streamlist.length; j++) {
			if (sessionList[i].streamlist[j].winindex == winindex) {
				return sessionList[i];
			}
		}
	}
	return null;
}
/**
  * Get the device channel according to the form index
  * @method GetChannelByWinindex
  * @param {number} winindex window index
  *
  * return
  * @return {number} channel channel
  */
function GetChannelByWinindex(winindex) {
	for (let i = 0; i < sessionList.length; i++) {
		for (let j = 0; j < sessionList[i].streamlist.length; j++) {
			if (sessionList[i].streamlist[j].winindex == winindex) {
				return j; //channel
			}
		}
	}
	return -1;
}
function getRecordList(params) {
	return SearchRecList;
}
//Initialize the p2p method
/**
  * Video stream callback
  * @method onrecvframeex
  * @param {object} api_conn connection status object
  * @param {number} frametype video frame type
  * @param {Buffer} data video frame data
  * @param {number} channel channel value
  * @param {number} width screen width
  * @param {number} height screen height
  */
ConnectApi.onrecvframeex = function (api_conn, frametype, data, datalen, channel, width, height, enc, fps, timestamp) {

	//window has been closed
	if (api_conn.streamlist[channel].winindex == -1) {
		return;
	}
	//Determine the type of stream, 0 is an audio frame
	if (frametype != 0) {
		data.recvtime = new Date().getTime();
		playerList[api_conn.streamlist[channel].winindex].fillframe_v2(data, datalen, enc, timestamp);
	} else {
		if (api_conn.streamlist[channel].isSound) {
			audioPlay(data, enc, datalen, width);
		}
	}
};

/**
  * Playback video stream callback
  * @method onrecvrecframe
  * @param {object} api_conn connection status object
  * @param {number} frametype video frame type
  * @param {Buffer} data video frame data
  * @param {number} channel channel value
  * @param {number} width screen width
  * @param {number} height screen height
  * @param {number} enc encoding format
  * @param {number} fps frame rate
  * @param {number} ts_ms The time length of this frame
  */
ConnectApi.onrecvrecframe = function (api_conn, frametype, data, datalen, channel, width, height, enc, fps, ts_ms) {
	if (api_conn.streamlist[channel].winindex == -1) {
		return;
	}
	if (!api_conn.streamlist[channel].firstFrame) {
		api_conn.streamlist[channel].firstFrame = true;
	}

	if (frametype != 0) {
		data.recvtime = new Date().getTime();
		playerList[api_conn.streamlist[channel].winindex].fillframe_v2(data, datalen, enc, ts_ms);
	} else {
		if (api_conn.streamlist[channel].isSound) {
			audioPlay(data, enc, datalen, width);
		}
	}
};

/**
  * Device connection callback
  * @method onconnect
  * @param {object} api_conn connection status object
  * @param {number} code connection status code 0: success, others: failure
  */
ConnectApi.onconnect = function (api_conn, code) {
	if (code == 0) {
		console.log((api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + 'connection succeed');

		ConnectApi.login(api_conn, api_conn.user, api_conn.pwd);
	} else {
		console.log((api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + 'connection failed ' + 'code：' + code);

	}
};
/**
  * Device login callback
  * @method onloginresult
  * @param {object} api_conn connection status object
  * @param {number} result login status code 0: success, others: failure
  */
ConnectApi.onloginresult = function (api_conn, result) {
	console.log(result);
	if (result == 0) {
		api_conn.logined = true;
		console.log(api_conn.deviceid + 'login succeed');
		for (let i = 0; i < api_conn.streamlist.length; i++) {
			if (api_conn.streamlist[i].winindex >= 0 && api_conn.connectType == 1) {
				ConnectApi.open_stream(api_conn, i, api_conn.streamlist[i].streamid);
				playerList[api_conn.streamlist[i].winindex].open()
			}
		}
	} else {
		console.log((api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + 'Login failed ' + 'code：' + result);

	}
};
/**
  * p2p error callback
  * @method onp2perror
  * @param {object} api_conn connection status object
  * @param {number} code error status code
  */
ConnectApi.onp2perror = function (api_conn, code) {
	console.log(code);
	console.log((api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + 'device p2p error');
};

/**
  * p2p connection disconnection callback
  * @method ondisconnect
  * @param {object} api_conn connection status object
  * @param {number} code error status code
  */
ConnectApi.ondisconnect = function (api_conn, code) {
	console.log(code);
	console.log((api_conn.deviceid ? api_conn.deviceid : api_conn.ip) + 'device disconnect');
	if (api_conn) {
		
	}
};

/**
  * Open the code stream callback
  * @method onopenstream
  * @param {object} api_conn connection status object
  * @param {number} channel channel
  * @param {number} streamid stream value 0/main stream 1/sub stream
  * @param {number} result login status code
  */
ConnectApi.onopenstream = function (api_conn, channel, streamid, result, cam_desc) {
	console.log(api_conn.deviceid + 'open stream; channel ' + channel + 'stream' + streamid);
	if (result != 0) {
		
	}
};
/**
  * PTZ control callback
  * @method onptzresult
  * @param {object} api_conn connection status object
  * @param {number} result status code
  */
ConnectApi.onptzresult = function (api_conn, result) {
	console.log('ptz callback');

};

/**
  * Query playback return data
  * @method onsearchrec
  * @param {object} api_conn connection status object
  * @param {number} channel channel
  * @param {string} file_type type
  * @param {string} file_begintime start time
  * @param {string} file_endtime end time
  * @param {string} file_total number
  */
ConnectApi.onsearchrec = function (api_conn, channel, file_type, file_begintime, file_endtime, file_total) {
	let data = {};
	data.eseeid = api_conn.deviceid;
	data.ip = api_conn.ip;
	data.channel = channel;
	data.file_type = file_type;
	data.file_begintime = file_begintime;
	data.file_endtime = file_endtime;
	data.file_total = file_total;
	SearchRecList.push(data)
};

/**
  * The query is completed, and the callback function is thrown to notify that it has ended
  * @method onsearchrecend
  * @param {object} api_conn connection status object
  */
ConnectApi.onsearchrecend = function (api_conn) {
	//sort and deduplicate
	function flieSort(list) {
		let file = JSON.parse(JSON.stringify(list));
		//Bubble sort, the latest time is at the top
		for (let i = 0; i < file.length; i++) {
			for (let j = 0; j < file.length - i - 1; j++) {
				if (file[j].file_begintime < file[j + 1].file_begintime) {
					let t = JSON.parse(JSON.stringify(file[j]));
					file[j] = JSON.parse(JSON.stringify(file[j + 1]));
					file[j + 1] = JSON.parse(JSON.stringify(t));
				}

			}
		}
		for (let i = 0; i < file.length; i++) {
			for (let j = 0; j < file.length - i - 1; j++) {
				if (file[j].file_begintime === file[j + 1].file_begintime) {
					file.splice(j + 1, 1);
					j--;
				}
			}
		}
		return file
	}
	SearchRecList = flieSort(SearchRecList)

};

/**
  * Close the code stream callback
  * @method onclosestream
  * @param {object} api_conn connection status object
  * @param {number} channel channel
  * @param {number} streamid stream value 0/main stream 1/sub stream
  * @param {number} result login status code
  */
ConnectApi.onclosestream = function (api_conn, channel, streamid, result) {

}

/**
  * Remote setting callback
  * @method onremotesetup
  * @param {object} api_conn connection status object
  * @param {string} str Remote setting return data
  * @param {number} data_size data length
  * @param {number} result status code
  */
ConnectApi.onremotesetup = function (api_conn, str, data_size, result) {
	if (str || result == 0) {

	} else {
		if (result == -70) {
			console.log('remote set error; code：' + result, api_conn, str);

		}
	}

}
/**
  * Player initialization
  * @method init
  * @param {array} playerArr player array, which stores canvas elements, each element represents a playback window
  */
Player.init = function (playerArr) {
	playerList = [];
	for (let i = 0; i < playerArr.length; i++) {
		//Initialize canvas player
		//parameter 1 canvas is the canvas used to display the screen
		//Parameter 2 can be directly specified as false
		//Parameter 3 is used for the context of the callback, starting from 0, and adding 1 for each creation
		let player = new kp2pPlayer(playerArr[i], false, i);
		playerList.push(player)
	}
}
/**
  * Connect the device
  * @method ConnectDevice
  * @param {string} devid device ID
  * @param {string} ip device ip
  * @param {string} user device username
  * @param {string} pwd device password
  * @param {number} winindex window index
  * @param {number} port ip port
  * @param {number} connectType connection method 0: pre-connect 1: connect and open stream
  * @param {number} channel channel
  * @param {number} streamid stream type, valid when connection mode is 1
  *
  * Note: There must be at least one ID and IP, and the ID connection is preferred. If there is an IP, the port must be passed.
  */
Player.ConnectDevice = function (devid, ip, user, pwd, winindex, port, connectType, channel, streamid) {

	//ID
	if (devid) {
		let session = GetSessionById(devid);
		let bConnect = false;
		//init session
		if (session == null) {
			session = ConnectApi.create(winindex, CryptoJS);
			session.refs = 0;
			session.logined = false;
			session.user = user;
			session.pwd = pwd;
			session.connectType = connectType;
			session.connectStatus = 0;
			session.streamlist = new Array(128);
			for (let i = 0; i < session.streamlist.length; i++) {
				session.streamlist[i] = {
					winindex: -1,
					streamid: -1,
					isSound: false,
					firstFrame: false
				};
			}
			sessionList.push(session);
			bConnect = true;
		}
		if (connectType === 1) {
			session.refs++;
			session.streamlist[channel].winindex = winindex;
			session.streamlist[channel].streamid = streamid;
		}

		if (bConnect) {
			ConnectApi.connectbyid(session, devid);
		}
		// else {
		//     ConnectApi.open_stream(session, channel, streamid);
		// }
	} else {
		let session = GetSessionByIp(ip);
		let bConnect = false;
		if (session == null) {
			session = ConnectApi.create(winindex, CryptoJS);
			session.refs = 0;
			session.logined = false;
			session.user = user;
			session.pwd = pwd;
			session.connectType = connectType;
			session.connectStatus = 0;
			session.streamlist = new Array(128);
			for (let i = 0; i < session.streamlist.length; i++) {
				session.streamlist[i] = {
					winindex: -1,
					streamid: -1,
					isSound: false,
					firstFrame: false
				};
			}
			sessionList.push(session);
			bConnect = true;
		}
		if (connectType === 1) {
			session.refs++;
			session.streamlist[channel].winindex = winindex;
			session.streamlist[channel].streamid = streamid;
		}


		if (bConnect) {
			ConnectApi.connectbyip(session, ip, port);
		}
		// else {
		//     ConnectApi.open_stream(session, channel, streamid);
		// }
	}

}

/**
  * Open the stream
  * @method OpenStream
  * @param {number} deviceid device id
  * @param {number} ip device ip
  * @param {number} channel channel
  * @param {number} streamid stream Main stream 0, sub stream 1
  * @param {number} winindex window index
  */
Player.OpenStream = function (deviceid, ip, channel, streamid, winindex) {
	let session = null;
	if (deviceid) {
		session = GetSessionById(deviceid);
	} else {
		session = GetSessionByIp(ip);

	}
	if (session != null && session.logined) {
		session.refs++;
		session.streamlist[channel].winindex = winindex;
		session.streamlist[channel].streamid = streamid;
		ConnectApi.open_stream(session, channel, streamid);
		playerList[winindex].open()
	}
}
/**
  * close the stream
  * @method CloseStream
  * @param {number} keyindex form index
  */
Player.CloseStream = function (keyindex) {
	let session = GetSessionByWinindex(keyindex);
	if (session != null) {
		let channel = GetChannelByWinindex(keyindex);
		if (channel >= 0) {
			ConnectApi.close_stream(session, channel, session.streamlist[channel].streamid);
			playerList[keyindex].close()
			// player1.close()
			session.refs--;
			session.streamlist[channel] = {
				winindex: -1,
				streamid: -1,
				isSound: false,
				firstFrame: false
			};
		}
	}
}
/**
  * Disconnect the device
  * @method DisConnectDevice
  * @param {string} deviceid device id
  * @param {string} ip device IP
  * Note: ID and IP must have at least one
  */
Player.DisConnectDevice = function (deviceid, ip) {
	if (deviceid) {
		let session = GetSessionById(deviceid);
		if (session) {
			ConnectApi.close_socket(session);

			for (let i = 0; i < sessionList.length; i++) {
				if (sessionList[i].deviceid === session.deviceid) {
					sessionList.splice(i, 1);
					break;
				}

			}

		}
	} else if (ip) {
		let session = GetSessionByIp(ip);
		if (session) {
			ConnectApi.close_socket(session);
			for (let i = 0; i < sessionList.length; i++) {
				if (sessionList[i].ip === session.ip) {
					sessionList.splice(i, 1);
					break;
				}
			}
		}
	}
}
/**
  * open audio
  * @method OpenAudio
  * @param {number} keyindex form index
  */
Player.OpenAudio = function (keyindex) {
	let session = GetSessionByWinindex(keyindex);
	if (session != null) {
		let channel = GetChannelByWinindex(keyindex);
		if (channel >= 0) {

			session.streamlist[channel].isSound = true;
		}
	}
	console.log(session);
}
/**
  * turn off audio
  * @method CloseAudio
  * @param {number} keyindex form index
  */
Player.CloseAudio = function (keyindex) {
	let session = GetSessionByWinindex(keyindex);
	console.log(session);
	if (session != null) {
		let channel = GetChannelByWinindex(keyindex);
		if (channel >= 0) {
			session.streamlist[channel].isSound = false;
		}
	}
}





/**
  * Start the gimbal
  * @method ptz_ctrl
  * @param {number} id device id
  * @param {number} channel gimbal channel
  * @param {string} type PTZ action 0: stop 1: auto pan 2: up 3: down 4: left 5: right 6: aperture plus 7: aperture minus 8: zoom plus 9: zoom minus 10: focus plus 11: Focus minus 12: Auxiliary switch 13: Set preset 14: Call preset 15: Clear preset
  * @param {string} param PTZ control parameters, set according to the action, 1-5 represent speed, 13 and 14 are preset positions
  */
Player.ptz_ctrl = function (id, ip, channel, type, param) {
	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}
	if (session) {
		ConnectApi.ptz_ctrl(session, channel, type, param, 0);
	}
};

/**
  * Video playback retrieval
  * @function SreachRecord
  * Start to query the recording, be careful not to perform two executions at the same time, the caller should be careful to prevent the user from performing other operations during the query
  * @param {string} id device id
  * @param {string} ip device ip
  * @param {number} channel channel
  * @param {number} begintime start time second timestamp
  * @param {number} endtime end time second timestamp
  * @param {number} type record type, 15 is all
  */
Player.SreachRecord = function (id, ip, channel, begintime, endtime, type) {
	// console.log(id, ip, channel, begintime, endtime, type);

	SearchRecList = [];
	let session = null;
	let chnlist = new Array(128);

	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}
	for (let i = 0; i < chnlist.length; i++) {
		chnlist[i] = 0;
		if (i == channel) {
			chnlist[i] = 1;
		}
	}
	if (session) {

		ConnectApi.find_file_start_2(session, chnlist, begintime, endtime, type)
	}
}

/**
  * Stop recording query
  * * @function Stopsearch
  * @param {number} id device id
  * @param {number} ip device ip
  */
Player.Stopsearch = function (id, ip) {
	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}
	if (session) {
		ConnectApi.find_file_stop_2(session)
	}
}

/**
 * start playback
* @function StartPlayBack
* @param {number} id device id
* @param {number} ip device ip
* @param {string} channel channel
* @param {string} begintime start time 10-digit timestamp
* @param {string} endtime end time 10-digit timestamp
* @param {string} type record type, 15 is all
* @param {string} winindex window index
* @param {string} isSound whether to enable audio
  */
Player.StartPlayBack = function (id, ip, channel, begintime, endtime, type, winindex, isSound) {
	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}

	if (session != null && session.logined) {
		//Playback forces the first window to play back
		session.refs++;
		session.streamlist[channel].winindex = winindex;
		session.streamlist[channel].streamid = 0;
		if (isSound) {
			session.streamlist[channel].isSound = true;
		}
		ConnectApi.replay_start(session, channel, begintime, endtime, type)
		console.log(channel, begintime, endtime, type);
		playerList[winindex].open()
	}

}

/**
  * pause
  * @function Playbacksuspended
  * @param {number} id device id
  * @param {number} ip device ip
  */

Player.PausePlayBack = function (id, ip) {
	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}

	if (session) {
		ConnectApi.replay_pause(session)
	}
}

/**
  * continue
  * @function Playbackcontinue
  * @param {number} id device id
  * @param {number} ip device ip
  */

Player.ContinuePlayBack = function (id, ip) {

	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}

	if (session) {

		ConnectApi.replay_continue(session)
	}
}

/**
  * stop playback
  * @function Playbackstop
  * @param {number} id device id
  * @param {number} ip device ip
  * @param {number} channel device channel
  */
Player.StopPlayBack = function (id, ip, channel) {
	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}

	if (session) {

		ConnectApi.replay_stop(session)
		playerList[session.streamlist[channel].winindex].close()
		session.streamlist[channel].firstFrame = false
		session.streamlist[channel].isSound = false
		session.streamlist[channel].winindex = -1;
	}
}

/**
  * Remote settings
  * @method RemoteSetting
  * @param { number } id form index
  * @param { number } ip form index
  * @param { number } str Remote setting content
  */

Player.RemoteSetting = function (id, ip, str) {
	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}
	if (session) {
		if (str.length > 2000) {
			ConnectApi.remote_setup2(session, str)
		} else {
			ConnectApi.remote_setup2(session, str);
		}

	}
}
/**
  * switch stream
  * @function ChangeStream
  * @param {string} id device id
  * @param {string} ip device ip
  * @param {number} channel channel
  * @param {number} newstreamid new stream value 0/main stream 1/secondary stream
  */
Player.ChangeStream = function (id, ip, channel, newstreamid) {
	let session = null;
	if (id) {
		session = GetSessionById(id);
	} else {
		session = GetSessionByIp(ip);
	}

	if (session) {
		session.streamlist[channel].firstFrame = false;
		ConnectApi.change_stream(session, channel, newstreamid);
	}
}