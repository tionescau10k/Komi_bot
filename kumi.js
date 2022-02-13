//modulos do bot 
const { decryptMedia } = require('@open-wa/wa-decrypt')
const fs = require('fs-extra')
const axios = require('axios')
const math = require('mathjs')
const { search } = require("simple-play-store-search")
const google = require('google-it')
const isPorn = require('is-porn')
const moment = require('moment-timezone')
const sinesp = require('sinesp-api')
const { Aki } = require('aki-api')
const request = require('request')
const canvacord = require('canvacord')
const canvas = require('canvas')
const ffmpeg = require('fluent-ffmpeg')
const { spawn, exec, execFile } = require('child_process')
const nhentai = require('nhentai-js')
const { API } = require('nhentai-api')
const { removeBackgroundFromImageBase64 } = require('remove.bg')
const fetch = require('node-fetch')
const ms = require('parse-ms')
const removeAccents = require('remove-accents')
const { stdout } = require('process')
const bent = require('bent')
const tts = require('node-gtts')
const brainly = require('brainly-scraper-v2')
const deepai = require('deepai')
const wiki = require("@dada513/wikipedia-search")
const { EmojiAPI } = require("emoji-api")
const os = require('os')
const puppeteer = require('puppeteer')
const { XVDL } = require("xvdl")
const sharp = require('sharp')
const acrcloud = require("acrcloud")
const Pokemon = require('pokemon.js')
const cron = require('node-cron')

//util
const { mylang } = require('./lib/lang')
const config = require('./lib/config/Gerais/config.json')
const { poll, gaming, color, sleep, isUrl, upload, addFilter, isFiltered, translate, isInt } = require('./lib/functions')
const options = { headless: true, userDataDir: "./logs/Chrome/Maker", args: ['--aggressive-cache-discard', '--disable-application-cache', '--disable-cache', '--disable-offline-load-stale-cache', '--disable-setuid-sandbox', '--disk-cache-size=0', '--ignore-certificate-errors', '--no-sandbox', '--single-process'] } 

//Json's
const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
const ctmprefix = JSON.parse(fs.readFileSync('./lib/config/Gerais/prefix.json'))
const nivel = JSON.parse(fs.readFileSync('./lib/config/Gerais/level.json'))
const custom = JSON.parse(fs.readFileSync('./lib/config/Gerais/custom.json'))
const cmds = JSON.parse(fs.readFileSync('./lib/config/Gerais/cmds.json'))
const hail = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'))
const _amigo = JSON.parse(fs.readFileSync('./database/bot/amigos.json'))


// ATIVADORES & CONFIGS EXTRAS
Pokemon.setLanguage('english');var region = config.Language
const aki = new Aki(region);const akinit = async () => { await aki.start() }
akinit().catch((error) => { console.log(color('[AKI]', 'crimson'), color(`→ kkkkk deu erro no akinator → ${error.message}.`, 'gold')) })
var mess = mylang(region);moment.tz.setDefault('America/Sao_Paulo').locale('pt_BR')
const emoji = new EmojiAPI();var jogadas = 0; var isMuteAll = 0; var oneImage = 0; var oneLink = 0; var oneTrava = 0; var isTyping = []; var noLimits = 0
axios.defaults.headers.common['User-Agent'] = config.User_Agent
const acr = new acrcloud({ host: config.Acr_Host, access_key: config.Acr_Access, access_secret: config.Acr_Secret })
var thePlayerGame = 0; var thePlayerGame2 = 0; var thePlayerGameOld = 0; var thePlayerGameOld2 = 0; var xjogadas = []; var ojogadas = []; var waitJogo = 0; var timesPlayed = 0; var tictacplays = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"]; var tttboard = { a1: 'A1', a2: 'A2', a3: 'A3', b1: 'B1', b2: 'B2', b3: 'B3', c1: 'C1', c2: 'C2', c3: 'C3' }; var finalAwnser = 0;var isValidGame = 0

module.exports = kconfig = async (komi, message) => {
	
	// Isso antes da try possibilita receber os alertas no WhatsApp
	const { type, id, from, t, sender, author, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList, selectedButtonId } = message
	const groupId = isGroupMsg ? chat.groupMetadata.id : ''
	var prefix = config.Prefix
   // const prefix = /^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/.test(command) ? command.match(/^[°•π÷×¶∆£¢€¥®™✓=|~!#$%^&./\\©^]/gi) : '-'
	for (let i = 0; i < ctmprefix.length; i++) { if (Object.keys(ctmprefix[i]) == groupId) { prefix = Object.values(ctmprefix[i]);break } }
	let { body } = message
	const ownerNumber = config.Owner
	const chats = (type === 'chat') ? body : ((type === 'image' || type === 'video')) ? caption : ''
	body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
	const comma = body.slice(1).trim().split(/ +/).shift().toLowerCase()
	const command = removeAccents(comma) || selectedButtonId
	
	try {
		
		// PARAMETROS & Daily
		//const _premium = JSON.parse(fs.readFileSync('./database/bot/premium.json'))
		var daily = JSON.parse(fs.readFileSync('./lib/config/Gerais/diario.json'))
		const { name, formattedTitle } = chat
		let { pushname, verifiedName, formattedName } = sender
		pushname = pushname || verifiedName || formattedName
		const botNumber = await komi.getHostNumber()
		const blockNumber = await komi.getBlockedIds()
		const user = sender.id
		const isOwner = ownerNumber.includes(user)
		const isBot = user === `${botNumber}@c.us`
		const groupMembers = isGroupMsg ? await komi.getGroupMembers(groupId) : false
		const groupMembersId = isGroupMsg ? await komi.getGroupMembersId(groupId) : false
		const groupAdmins = isGroupMsg ? await komi.getGroupAdmins(groupId) : ''
		const isGroupAdmins = isGroupMsg ? groupAdmins.includes(user) : false
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber + '@c.us') : false
		const isNsfw = isGroupMsg ? functions[0].nsfw.includes(groupId) : false
		const autoSticker = isGroupMsg ? functions[0].sticker.includes(groupId) : false
		const time = moment(t * 1000).format('DD/MM HH:mm:ss')
		const processTime = (timestamp, now) => { return moment.duration(now - moment(timestamp * 1000)).asSeconds() }
		const arg = body.trim().substring(body.indexOf(' ') + 1)
		const args = body.trim().split(/ +/).slice(1)
		const isCmd = body.startsWith(prefix)
		const url = args.length !== 0 ? args[0] : ''
		const uaOverride = config.User_Agent
		const isBlocked = blockNumber.includes(user)
		const isAntiPorn = isGroupMsg ? functions[0].antiporn.includes(groupId) : false
		const isAntiTravas = isGroupMsg ? functions[0].antitrava.includes(groupId) : false
		const isAntiLink = isGroupMsg ? functions[0].antilinks.includes(groupId) : false
		const isxp = isGroupMsg ? functions[0].xp.includes(groupId) : false
		const mute = isGroupMsg ? functions[0].silence.includes(groupId) : false
		const pvmte = !isGroupMsg ? functions[0].silence.includes(user) : false
		const isPremium = _amigo.includes(sender.id)
		//const isPremium = premium.checkPremiumUser(sender.id, _premium) || isFriend
		const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
		const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
		const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
		const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
		const isQuotedAudio = quotedMsg && quotedMsg.type === 'audio'
		const isQuotedPtt = quotedMsg && quotedMsg.type === 'ptt'
		const isImage = type === 'image'
		const isVideo = type === 'video'
		const isAudio = type === 'audio'
		const isPtt = type === 'ptt'
		const isGif = mimetype === 'image/gif'
		const arqs = body.trim().split(' ')
		const arks = args.join(' ')
		const isTrava = type === 'oversized'
		const limitCount = 50
		const aMemberS = isGroupMsg ? groupMembers[Math.floor(Math.random() * groupMembers.length)] : user
		const randomMember = isGroupMsg ? aMemberS.id : user
	
		// OUTRAS
	//	premium.expiredCheck(_premium)
        //if (_ttt.length >= 1) {premium.expiredCheck2(_ttt) }


        cron.schedule('30 0 * * *', () => {
            const reset = []
            _limit = reset
            console.log('Resetando todos os limites chefe')
            fs.writeFileSync('./lib/config/Gerais/limit.json', JSON.stringify(_limit))
            console.log('Sucesso!')
        }, {
            scheduled: true,
            timezone: 'America/Sao_Paulo'
        })





		const side = Math.floor(Math.random() * 2) + 1
		var lvpc = Math.floor(Math.random() * 100) + 1
		const lvrq = 100 - lvpc
		const milSort = Math.floor(Math.random() * 1000) + 1
		global.pollfile = `config_vote-${groupId.replace('@c.us', '')}.json`
		global.voterslistfile = `vote_poll-${groupId.replace('@c.us', '')}.json`
		const errorurl = 'https://img.wallpapersafari.com/desktop/1920/1080/19/44/evOxST.jpg'
		const errorImg = 'https://i.ibb.co/jRCpLfn/user.png'
		const komiMsgs = await fs.readFileSync('./lib/config/Utilidades/reply.txt').toString().split('\n')
		const chatBotR = komiMsgs[Math.floor(Math.random() * komiMsgs.length)].replace('%name$', `${name}`).replace('%battery%', `${lvpc}`)
		const lgbt = await fs.readFileSync('./lib/config/Utilidades/lgbt.txt').toString().split('\n')
		const guei = lgbt[Math.floor(Math.random() * lgbt.length)]
		const weaponC = await fs.readFileSync('./lib/config/Utilidades/armas.txt').toString().split('\n')
		const whatWeapon = weaponC[Math.floor(Math.random() * weaponC.length)]
		const checkLvL = await gaming.getValue(user, nivel, 'level')
		const patente = await gaming.getPatent(checkLvL)
		const getReqXP = (theRcvLvL) => { return Number(config.XP_Difficulty) * Math.pow(theRcvLvL, 2) * Number(config.XP_Difficulty) + 1000 }
		const valueRand = (value) => { const valres = value[Math.floor(Math.random() * value.length)];return valres }
		const tagsPorn = await fs.readFileSync('./lib/config/Utilidades/porn.txt').toString().split('\n')
		const theTagPorn = tagsPorn[Math.floor(Math.random() * tagsPorn.length)]
		const aWorldCits = await fs.readFileSync('./lib/config/Utilidades/frases.txt').toString().split('\n')
		const theCitacion = aWorldCits[Math.floor(Math.random() * aWorldCits.length)]
		const getBrain = await fs.readFileSync('./lib/config/Utilidades/curiosidades.txt').toString().split('\n')
		const thiskomiCats = getBrain[Math.floor(Math.random() * getBrain.length)]
		const bibleal = await fs.readFileSync('./lib/config/Utilidades/biblia.txt').toString().split('\n')
		const randomBible = bibleal[Math.floor(Math.random() * bibleal.length)]
		const fml = await fs.readFileSync('./lib/config/Utilidades/fml.txt').toString().split('\n')
		const fmylife = fml[Math.floor(Math.random() * fml.length)]
		const letmeHpy = await fs.readFileSync('./lib/config/Utilidades/cantadas.txt').toString().split('\n')
		const getHappyness = letmeHpy[Math.floor(Math.random() * letmeHpy.length)]
		const neverT = await fs.readFileSync('./lib/config/Utilidades/never.txt').toString().split('\n')
		const getNeverland = neverT[Math.floor(Math.random() * neverT.length)]
		const getChifre = await fs.readFileSync('./lib/config/Utilidades/corno.txt').toString().split('\n')
		const howGado = getChifre[Math.floor(Math.random() * getChifre.length)]
		//const isPremium = premium.checkPremiumUser(sender.id, _premium)

		// Sistema que permite ignorar comandos de um grupo, caso você já possua um BOT nele e queira deixar a Íris desligada apenas lá, basta ativar
		/*if (isGroupMsg && isCmd && !isOwner && !isBot && groupId == 'Insira a id do grupo') return*/
		
		// Muda a linguagem para a requisitada no comando newlang
		if (isGroupMsg && isCmd && functions[0].en.includes(groupId)) { mess = mylang('en') }
		if (isGroupMsg && isCmd && functions[0].es.includes(groupId)) { mess = mylang('es') }
		if (isGroupMsg && isCmd && functions[0].pt.includes(groupId)) { mess = mylang('pt') }
		
		// Ensina a rodar comandos pelo WhatsApp da BOT
		if (isBot && isCmd && chatId !== `${botNumber}@c.us`) await komi.reply(ownerNumber[0], mess.howtorun(`wa.me/+${botNumber}`), id)
		
		// Mantém a BOT escrevendo caso o dono queira
		if (isGroupMsg && isTyping.includes(groupId) || isCmd) await komi.simulateTyping(from, true)

		// Sistema do XP - Baseado no de Bocchi - Slavyan
		if (isGroupMsg && isxp && !gaming.isWin(user) && !isBlocked) {
			try {
				await gaming.wait(user);var gainedXP = Math.floor(Math.random() * Number(config.Max_XP_Earn)) + Number(config.Min_XP_Earn);const usuarioLevel = await gaming.getValue(user, nivel, 'level')
				if (functions[0].companions.includes(user)) { gainedXP = parseInt(gainedXP + (usuarioLevel * 5), 10) } // Beneficio de guilda Companions, XP 5x mais
				if (functions[0].thieves.includes(user)) { gainedXP = parseInt(gainedXP + (usuarioLevel * 3), 10) } // Beneficio de guilda Thieves, XP 3x mais
				await gaming.addValue(user, Number(gainedXP), nivel, 'xp')
				const haveXptoUp = await gaming.getValue(user, nivel, 'xp')
				if (getReqXP(checkLvL) <= haveXptoUp) {
					await gaming.addValue(user, 1, nivel, 'level');await gaming.addValue(user, Number(config.komi_Coin), nivel, 'coin')
					await komi.reply(from, `*「 +1 NIVEL 」*\n\n➸ *Nome:* ${pushname}\n➸ *XP:* ${await gaming.getValue(user, nivel, 'xp')} / ${getReqXP(checkLvL)}\n➸ *Level:* ${checkLvL} -> ${await gaming.getValue(user, nivel, 'level')} 🆙 \n➸ *Í-Coin:* ${await gaming.getValue(user, nivel, 'coin')}\n➸ *Patente:* *${patente}* 🎉`, id)
					// Desative ou Apague a "komi.reply" acima se sua Íris floodar mensagens de "Level UP"
				}
			} catch (err) { console.log(color('[XP]', 'crimson'), err) }
		}
		
		// Adiciona nível caso tenha ganhado XP demais
		const justCheckLvL = await gaming.getValue(user, nivel, 'level')
		const justCheckXP = await gaming.getValue(user, nivel, 'xp')
		if (justCheckXP >= getReqXP(justCheckLvL)) { await gaming.addValue(user, 1, nivel, 'level') }
		
		// Anti Imagens pornográficas
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiPorn && isMedia && isImage && !isCmd && !isOwner && oneImage == 0 && !isBot) {
			try {
				oneImage = 1; console.log(color('[IMAGEM]', 'red'), color('Verificando a imagem por pornografia...', 'yellow'))
				const mediaData = await decryptMedia(message, uaOverride)
				const getUrl = await upload(mediaData, false)
				deepai.setApiKey(config.API_DeepAI)
				const resp = await deepai.callStandardApi("nsfw-detector", { image: `${getUrl}` })
				if (resp.output.nsfw_score > 0.85) {
					await komi.removeParticipant(groupId, user).then(async () => { await komi.sendTextWithMentions(from, mess.baninjusto(user) + 'Porno.') })
					console.log(color('[NSFW]', 'red'), color(`A imagem contém traços de conteúdo adulto, removerei o → ${pushname} - [${user}]...`, 'yellow'));return oneImage = 0
				} else { console.log(color('[SEM NSFW]', 'lime'), color(`→ A imagem não parece ser pornográfica.`, 'gold'));oneImage = 0 }
			} catch (error) { return oneImage = 0 }
		}
		
		// Auto-stickers de fotos
		if (isGroupMsg && autoSticker && isMedia && isImage && !isCmd && !isBot) {
			const mediaData = await decryptMedia(message, uaOverride)
			await komi.sendImageAsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
		}
		
		// Auto-sticker de videos & gifs
		if (isGroupMsg && autoSticker && isMedia && isVideo && !isCmd && !isBot) {
			const mediaData = await decryptMedia(message, uaOverride)
			await komi.sendMp4AsSticker(from, `data:${mimetype};base64,${mediaData.toString('base64')}`, null, { stickerMetadata: true, pack: config.Sticker_Pack, author: config.Sticker_Author, fps: 10, crop: false, loop: 0 })
		}

		// Anti links de grupo
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiLink && !isOwner && oneLink == 0 && !isBot) {
			try {
				if (chats.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
					oneLink = 1; const gplka = await komi.inviteInfo(chats)
					if (gplka) {
						console.log(color('[BAN]', 'red'), color('Link de grupo detectado, removendo participante...', 'yellow'))
						await komi.removeParticipant(groupId, user).then(async () => { await komi.sendTextWithMentions(from, mess.baninjusto(user) + 'WhatsApp Link.');return oneLink = 0 })
					} else { console.log(color('[ALERTA]', 'yellow'), color('Link de grupo invalido recebido...', 'yellow'));oneLink = 0 }
				}
			} catch (error) { return oneLink = 0 }
		}

		// Bloqueia todas as travas, seja contato, localização, texto e outros
		if (isGroupMsg && isAntiTravas && isTrava && !isGroupAdmins && isBotGroupAdmins && !isOwner && oneTrava == 0 && !isBot) {
			try {
				oneTrava = 1; console.log(color('[TRAVA]', 'red'), color(`Possível trava recebida pelo → ${pushname} - [${user.replace('@c.us', '')}] em ${name}...`, 'yellow'))
				let wakeAdm = 'ACORDA - WAKE UP ADM\n\n'
				var shrekDes = ''
				for (let i = 0; i < 20; i++) { shrekDes += `⡴⠑⡄⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀\n⡇⠀⠿⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀\n⠀⠀⠀⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆\n⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆\n⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢴⣆ \n⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⡿ \n⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉\n⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿\n⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇\n⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃\n⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁\n⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉\n\n` }
				for (let adminls of groupAdmins) { wakeAdm += `➸ @${adminls.replace(/@c.us/g, '')}\n` }
				await komi.removeParticipant(groupId, user).then(async () => { await komi.setGroupToAdminsOnly(groupId, true) }) // Fecha só para admins e bane o cara que travou
				await komi.sendText(from, shrekDes, id).then(async () => { await komi.sendTextWithMentions(from, wakeAdm) })  // Anti-Trava BR do Shrek muahauhauha + Chamar ADMS
				await komi.sendTextWithMentions(from, mess.baninjusto(user) + 'Travas.').then(async () => { await komi.sendText(from, mess.nopanic(), id) }) // Manda o motivo do ban e explica para os membros
				await komi.sendText(ownerNumber[0], mess.recTrava(user) + `\nAt/No > ${name}`).then(async () => { await komi.contactBlock(user) }) // Avisa o dono do bot e bloqueia o cara
				await komi.setGroupToAdminsOnly(groupId, false);return oneTrava = 0 // Reabre o grupo
			} catch (error) { return oneTrava = 0 }
		}
		
		// Bloqueia travas no PV
		if (!isGroupMsg && !isOwner && isTrava && !isBot) { await komi.contactBlock(user).then(async () => { await komi.sendText(ownerNumber[0], mess.recTrava(user)) }) }
		// Para limpar automaticamente sem você verificar, adicione "await komi.clearChat(chatId)", o mesmo no de grupos.

		// Anti links pornográficos
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiPorn && !isOwner && oneLink == 0 && !isBot) {
			try {
				if (isUrl(chats)) {
					oneLink = 1; const inilkn = new URL(chats)
					console.log(color('[URL]', 'yellow'), 'URL recebida →', inilkn.hostname)
					await isPorn(inilkn.hostname, async (err, status) => {
						if (err) return console.error(err)
						if (status) {
							console.log(color('[NSFW]', 'red'), color(`O link é pornografico, removerei o → ${pushname} - [${user.replace('@c.us', '')}]...`, 'yellow'))
							await komi.removeParticipant(groupId, user).then(async () => { await komi.sendTextWithMentions(from, mess.baninjusto(user) + 'Porno/Porn.');return oneLink = 0 })
						} else { console.log(color('[SEM NSFW]', 'lime'), color(`→ O link não possui pornografia.`, 'gold'));oneLink = 0 }
					})
				}
			} catch (error) { return oneLink = 0 }
		}
		
		// Impede travas ou textos que tenham mais de 5.000 linhas
		if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && !isOwner && oneTrava == 0 && !isBot) {
			try {
				if (chats.length > Number(config.Max_Characters)) {
					oneTrava = 1; console.log(color('[TRAVA]', 'red'), color(`Possivel trava recebida pelo → ${pushname} - [${user.replace('@c.us', '')}] em ${name}...`, 'yellow'))
					await komi.removeParticipant(groupId, user).then(async () => { await komi.sendTextWithMentions(from, mess.baninjusto(user) + 'Travas.') }) // Remove e manda o motivo no grupo
					await komi.sendText(ownerNumber[0], mess.recTrava(user)).then(async () => { await komi.contactBlock(user);return oneTrava = 0 }) // Avisa o dono e então bloqueia a pessoa
				}
			} catch (error) { return oneTrava = 0}
		}
		
		// Bloqueia travas no PV que tenham mais de 5.000 linhas
		if (!isGroupMsg && !isOwner && !isBot) {
			try {
				if (chats.length > Number(config.Max_Characters)) {
					console.log(color('[TRAVA]', 'red'), color(`Possivel trava recebida pelo → ${pushname} - [${user.replace('@c.us', '')}]...`, 'yellow'))
					return await komi.contactBlock(user).then(async () => { await komi.sendText(ownerNumber[0], mess.recTrava(user)) }) // Avisa o dono e bloqueia
				}
			} catch (error) { return }
		}
		
		 // Automate
		 /*premium.expiredCheck(_premium)
		 cron.schedule('0 0 * * *', () => {
			 const reset = []
			 _limit = reset
			 console.log('Hang tight, it\'s time to reset usage limits...')
			 fs.writeFileSync('./database/user/limit.json', JSON.stringify(_limit))
			 console.log('Success!')
		 }, {
			 scheduled: true,
			 timezone: 'Asia/Jakarta'
		 })
 */
		// Ative para banir quem mandar todos os tipos de links (Ative removendo a /* e */)
		/*if (isGroupMsg && !isGroupAdmins && isBotGroupAdmins && isAntiLink && !isOwner && isUrl(chats) && !isBot) return await komi.removeParticipant(groupId, user)*/
		
		// Comandos sem prefix, esse responde se marcar a BOT
		if (!isFiltered(from) && !isMedia && !isCmd) { try { if (chats.includes(`@${botNumber.replace('@c.us', '')}`)) { await komi.reply(from, chatBotR, id) } } catch (error) { return } }
		
		// Caso deseje criar siga o estilo disso abaixo, para usar a base remova a /* e a */
		/*if (!isFiltered(from) && !isCmd) { try { if (chats.toLowerCase() == 'Mensagem a receber, sem espaços') await komi.reply(from, 'Resposta para enviar', id) } catch (error) { return } }*/
		// Se falhar você pode tentar chats.toLowerCase().includes
		
		// Impede comandos em PV'S mutados
		if (!isGroupMsg && isCmd && pvmte && !isOwner) return console.log(color('> [SILENCIADO]', 'red'), color(`Ignorando comando de ${pushname} - [${user.replace('@c.us', '')}] pois ele está mutado...`, 'yellow'))
		
		// Impede comandos em grupos mutados
		if (isGroupMsg && isCmd && !isGroupAdmins && mute && !isOwner) return console.log(color('> [SILENCIADO]', 'red'), color(`Ignorando comando de ${name} pois ele está mutado...`, 'yellow'))

		// Muta geral, reseta ao reiniciar
		if (isCmd && !isOwner && isMuteAll == 1) return console.log(color('> [SILENCIADO]', 'red'), color(`Ignorando comando de ${pushname} pois os PV'S e Grupos estão mutados...`, 'yellow'))

		// Ignora pessoas bloqueadas
		if (isBlocked && isCmd && !isOwner) return console.log(color('> [BLOCK]', 'red'), color(`Ignorando comando de ${pushname} - [${user.replace('@c.us', '')}] por ele estar bloqueado...`, 'yellow'))

		// Anti Flood para PV'S
		if (isCmd && isFiltered(from) && !isGroupMsg && !isOwner) { await gaming.addValue(user, Number(-100), nivel, 'xp'); return console.log(color('> [FLOOD AS]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`, 'red')) }
		
		// Anti Flood para grupos
		if (isCmd && isFiltered(from) && isGroupMsg && !isOwner) { await gaming.addValue(user, Number(-100), nivel, 'xp'); return console.log(color('> [FLOOD AS]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`, 'red'), 'EM', color(`"${name || formattedTitle}"`)) }
		
		// Contador de Mensagens (em grupo) | Para contar do PV bote sem aspas "isGroupMsg || !isGroupMsg"
		if (isGroupMsg) { await gaming.getValue(user, nivel, 'msg');await gaming.addValue(user, 1, nivel, 'msg') }
		
		// Mensagens no PV
		if (!isCmd && !isGroupMsg) { return console.log('> MENSAGEM AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`)) }
		
		// Mensagem em Grupo
		if (!isCmd && isGroupMsg) { return console.log('> MENSAGEM AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'purple'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`), 'NO GP', color(`"${name || formattedTitle}"`)) }
		
		// Comandos no PV
		if (isCmd && !isGroupMsg) { console.log(color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`)) }
		
		// Comandos em grupo
		if (isCmd && isGroupMsg) { console.log(color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'purple'), 'DE', color(`"${pushname} - [${user.replace('@c.us', '')}]"`), 'NO GP', color(`"${name || formattedTitle}"`)) }

		// Impede SPAM
		if (isCmd && !isOwner) await addFilter(from) // Para limitar os usuários em vez do grupo, troque o "from" por "user"



		switch(command) {
            case 'sticker':;case 'fig':;case 'figurinha':;case 'stiker':;case 'f':;case 's':;case 'stickergif':;case 'gif':;case 'g':;case 'gifsticker':
				const sharpre = async (mimetype, isCircle, noCut, mediaData) => { await sharp(mediaData).resize({ width: 512, height: 512, fit: 'fill' }).toBuffer().then(async (resizedImageBuffer) => { await komi.sendImageAsSticker(from, `data:${mimetype};base64,${resizedImageBuffer.toString('base64')}`, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: noCut, circle: isCircle }) }) }
				if (isMedia && isImage || isQuotedImage) {
					await komi.reply(from, mess.wait(), id)
					const mediaMessage = isQuotedImage ? quotedMsg : message
					const messageMimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
					const mediaData = await decryptMedia(mediaMessage, uaOverride)
					if (arks.includes('-circle')) { var isCircle = true } else { var isCircle = false }
					if (arks.includes('-cut')) { var noCut = false } else { var noCut = true }
					if (arks.includes('-fill')) { return await sharpre(messageMimetype, isCircle, noCut, mediaData) }
					await komi.sendImageAsSticker(from, `data:${messageMimetype};base64,${mediaData.toString('base64')}`, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: noCut, circle: isCircle })
				} else if (isMedia && isVideo || isGif || isQuotedVideo || isQuotedGif) {
					await komi.reply(from, mess.wait(), id)
					const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
					const mediaData = await decryptMedia(encryptMedia, uaOverride)
					await komi.sendMp4AsSticker(from, mediaData, null, { stickerMetadata: true, pack: config.Sticker_Pack, author: config.Sticker_Author, fps: 10, crop: false, loop: 0 }).catch(async () => { await komi.reply(from, mess.gifail(), id) })
				} else if (args.length == 1) {
					await komi.reply(from, mess.wait(), id)
					if (isUrl(url)) {
						if (arks.includes('-circle')) { var isCircle = true } else { var isCircle = false }
						if (arks.includes('-cut')) { var noCut = false } else { var noCut = true }
						await komi.sendStickerfromUrl(from, url, { method: 'get' }, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: noCut, circle: isCircle })
					} else return await komi.reply(from, mess.nolink(), id)
				} else return await komi.reply(from, mess.sticker(), id)
				break

                case 'play':
                    case 'p':
                    case 'musica':    
                    case 'musica1':    
                      misc.ytPlay3(encodeURIComponent(args))
                          .then(async ({ titulo,duracao,link,tamanho,url_dl }) => {
                            function baseURI(buffer = Buffer.from([]), metatype = 'text/plain') {
                                return `data:${metatype};base64,${buffer.toString('base64')}`
                            }
                                if (Number(tamanho.split('MB')[0]) >= 11.0) return komi.reply(from, `A musica encontrada possui mais que 10MB\nEscolha uma musica menor.` ,id)
                                if (Number(tamanho.split('GB')[0]) >= 0.1) return komi.reply(from, `A musica encontrada possui mais que 10MB\nEscolha uma musica menor.` ,id)
                                await komi.sendFile(from, baseURI(await getBuffer(url_dl), 'audio/mp3'), 'aaa.mp3', '', id)
                                console.log('Sucesso enviado Play MP3!')
                          })
                          .catch(async (err) => {
                              console.error(err)
                              await komi.reply(from, `Ocorreu um erro!\nTente /play2, /play3 ou /play4`, id)
                          })
                  break
				
			case 'ttp':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.sendStickerfromUrl(from, `https://api.xteam.xyz/ttp?file&text=${encodeURIComponent(body.slice(5))}`, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'attp':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.reply(from, mess.wait(), id)
				await komi.sendStickerfromUrl(from, `http://api-exteam.herokuapp.com/api/fun/attp?apikey=fKh7vrzy&text=${encodeURIComponent(body.slice(6))}`, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break

                
			case 'wasted':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const wastedPict = isQuotedImage ? quotedMsg : message
						const getWastedPic = await decryptMedia(wantedPict, uaOverride)
						var thePicWasted = await upload(getWastedPic, false)
					} else { var thePicWasted = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (thePicWasted == null || typeof thePicWasted === 'object') thePicWasted = errorImg
					await canvacord.Canvas.wasted(thePicWasted).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `wasted.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[WASTED]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'trigger':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const triggermd = isQuotedImage ? quotedMsg : message
						const upTrigger = await decryptMedia(triggermd, uaOverride)
						var getTrigger = await upload(upTrigger, false)
					} else { var getTrigger = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (getTrigger == null || typeof getTrigger === 'object') getTrigger = errorImg
					await canvacord.Canvas.trigger(getTrigger).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `trigger.png`, 'Run...', id) })
				} catch (error) {
					console.log(color('[TRIGGER]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					await komi.reply(from, mess.fail(), id)
				}
				break
				
			case 'nobg':
				if (isImage || isQuotedImage) {
					const nobgmd = isQuotedImage ? quotedMsg : message
					const mediaData = await decryptMedia(nobgmd, uaOverride)
					const imageBase64 = `data:${nobgmd.mimetype};base64,${mediaData.toString('base64')}`
					await komi.reply(from, mess.wait(), id) 
					const base64img = imageBase64
					const outFile = `./lib/media/img/${user.replace('@c.us', '')}noBg.png`
					var result = await removeBackgroundFromImageBase64({ base64img, apiKey: config.API_RemoveBG, size: 'auto', type: 'auto', outFile })
					await fs.writeFile(outFile, result.base64img)
					await komi.sendImageAsSticker(from, `data:${nobgmd.mimetype};base64,${result.base64img}`, { pack: config.Sticker_Pack, author: config.Sticker_Author, keepScale: true })
					await komi.reply(from, mess.nobgms(), id)
					await sleep(10000).then(async () => { await fs.unlinkSync(`./lib/media/img/${user.replace('@c.us', '')}noBg.png`) })
				} else return await komi.reply(from, mess.onlyimg(), id)
				break
				
			case 'simg':
				if (isImage || isQuotedImage) {
					const shimgoh = isQuotedImage ? quotedMsg : message
					const mediaData = await decryptMedia(shimgoh, uaOverride)
					await komi.reply(from, mess.wait(), id)
					const sImgUp = await upload(mediaData, false)
					const sbrowser = await puppeteer.launch(options)
					const spage = await sbrowser.newPage()
					await spage.goto('https://www.google.com/searchbyimage?image_url=' + encodeURIComponent(sImgUp))
					const simages = await spage.evaluate(() => { return Array.from(document.body.querySelectorAll('div div a h3')).slice(2).map(e => e.parentNode).map(el => ({ url: el.href, title: el.querySelector('h3').innerHTML })) })
					await sbrowser.close()
					var titleS = `🔎 「 Google Imagens 」 🔎\n\n`
					for (let i = 1; i < simages.length; i++) { titleS += `${simages[i].title}\n${simages[i].url}\n\n══════════════════════════════\n\n` }
					await komi.reply(from, titleS, id).catch(async () => { await komi.reply(from, mess.upfail(), id) })
				} else return await komi.reply(from, mess.onlyimg(), id)
				break
				
			case 'upimg':
				if (isImage || isQuotedImage) {
					const upimgoh = isQuotedImage ? quotedMsg : message
					const mediaData = await decryptMedia(upimgoh, uaOverride)
					const upImg = await upload(mediaData, false)
					await komi.reply(from, mess.tempimg(upImg), id).catch(async () => { await komi.reply(from, mess.upfail(), id) })
				} else return await komi.reply(from, mess.onlyimg(), id)
				break
				
			case 'getsticker':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				const stkm = await fetch(`https://api.fdci.se/sosmed/rep.php?gambar=${encodeURIComponent(body.slice(12))}`)
				const stimg = await stkm.json()
				let stkfm = stimg[Math.floor(Math.random() * stimg.length) + 1]
				if (stkfm == null) return await komi.reply(from, mess.noresult(), id)
				await komi.sendStickerfromUrl(from, stkfm, { method: 'get' }, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'morte':;case 'death':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				const predea = await axios.get(`https://api.agify.io/?name=${encodeURIComponent(args[0])}`)
				if (predea.data.age == null) return await komi.reply(from, mess.validname(), id)
				await komi.reply(from, mess.death(predea), id)
				break			
				
			case 'oculto':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await komi.sendTextWithMentions(from, mess.oculto(randomMember, theTagPorn))
				break
				
			case 'gender':;case 'genero':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite nomes', id)
				const seanl = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(args[0])}`)
				if (seanl.data.gender == null) return await komi.reply(from, mess.validname(), id)
				await komi.reply(from, mess.genero(seanl), id)
				break
				
			case 'detector':
				case 'gostosa':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await komi.reply(from, mess.wait(), id)
				await komi.sendTextWithMentions(from, mess.gostosa(randomMember))
				break
				
			case 'math':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'add número e sinais', id)
				const mtk = body.slice(6)
				try {
					if (typeof math.evaluate(mtk) !== "número") return await komi.reply(from, mess.onlynumber() + '\nUse +	-  *  /', id)
					await komi.reply(from, `${mtk}\n\n*=*\n\n${math.evaluate(mtk)}`, id)
				} catch (error) {
					await komi.reply(from, mess.onlynumber() + '\n+, -, *, /', id)
					console.log(color('[MATH]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'inverter':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.reply(from, `${body.slice(10).split('').reverse().join('')}`, id)
				break
				
			case 'contar':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.reply(from, mess.contar(body, args), id)
				break
				
			case 'giphy':
				if (args.length !== 1) return await komi.reply(from, mess.nolink(), id)
				const isGiphy = url.match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'))
				const isMediaGiphy = url.match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'))
				if (isGiphy) {
					const getGiphyCode = url.match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'))
					if (!getGiphyCode) { return await komi.reply(from, mess.fail() + '\n\nGiphy site error.', id) }
					const giphyCode = getGiphyCode[0].replace(/[-\/]/gi, '')
					const smallGifUrl = 'https://media.giphy.com/media/' + giphyCode + '/giphy-downsized.gif'
					await komi.sendGiphyAsSticker(from, smallGifUrl)
				} else if (isMediaGiphy) {
					const gifUrl = url.match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'))
					if (!gifUrl) { return await komi.reply(from, mess.fail() + '\n\nGiphy site error.', id) }
					const smallGifUrl = url.replace(gifUrl[0], 'giphy-downsized.gif')
					await komi.sendGiphyAsSticker(from, smallGifUrl)
				} else return await komi.reply(from, mess.nolink(), id)
				break
				
			case 'msg':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.sendText(from, `${body.slice(5)}`)
				break
				
			case 'id':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await komi.reply(from, mess.idgrupo(groupId), id)
				break
				
			case 'fake':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].fake.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].fake.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].fake.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].fake.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else return await komi.reply(from, mess.soademiro(), id)
				break
				
			case 'blacklist':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].blacklist.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].blacklist.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].blacklist.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].blacklist.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else return await komi.reply(from, mess.soademiro(), id)
				break
				
			case 'bklist':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length == 0) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						const bkls = body.slice(11) + '@c.us'
						if (functions[0].anti.includes(bkls)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].anti.push(bkls)
						await fs.writeFileSync('./lib/config/Gerais/anti.json', JSON.stringify(functions))
						await komi.reply(from, mess.bkliston(), id)
					} else if (args[0].toLowerCase() == 'off') {
						const bkls = body.slice(11) + '@c.us'
						if (!functions[0].anti.includes(bkls)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].anti.splice(bkls, 1)
						await fs.writeFileSync('./lib/config/Gerais/anti.json', JSON.stringify(functions))
						await komi.reply(from, mess.bklistoff(), id)
					} else return await komi.reply(from, mess.kldica2(), id)
				} else return await komi.reply(from, mess.soademiro(), id)
				break
				
			case 'onlyadms':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (!isGroupAdmins) return await komi.reply(from, mess.soademiro(), id)
				if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
				if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
				if (args[0].toLowerCase() == 'on') {
					await komi.setGroupToAdminsOnly(groupId, true).then(async () => { await komi.sendText(from, mess.admson()) })
				} else if (args[0].toLowerCase() == 'off') {
					await komi.setGroupToAdminsOnly(groupId, false).then(async () => { await komi.sendText(from, mess.admsoff()) })
				} else return await komi.reply(from, mess.kldica1(), id)
				break

                
			case 'revoke':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (!isGroupAdmins) return await komi.reply(from, mess.soademiro(), id)
				if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
				await komi.revokeGroupInviteLink(groupId).then(async () => { await komi.reply(from, mess.revoga(), id) })
				break
				
			case 'water':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				try {
					if (arks.length >= 16) return await komi.reply(from, 'Max: 10 letras', id)
					await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
					const browser = await puppeteer.launch(options)
					const page = await browser.newPage()
					await page.goto("https://textpro.me/dropwater-text-effect-872.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
						await page.waitForSelector('#text-0')
						await page.type("#text-0", body.slice(6))
						await page.click("#submit")
						await sleep(10000) // Aumente se sua conexão for superr lenta
						await page.waitForSelector('div[class="thumbnail"] > img')
						const divElement = await page.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
						await komi.sendFileFromUrl(from, divElement, 'neon.jpg', '', id)
						await browser.close()
					})
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[WATER]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'setimage':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (!isGroupAdmins) return await komi.reply(from, mess.soademiro(), id)
				if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
				if (isMedia && type == 'image' || isQuotedImage) {
					const dataMedia = isQuotedImage ? quotedMsg : message
					const mediaData = await decryptMedia(dataMedia, uaOverride)
					const picgp = await komi.getProfilePicFromServer(groupId)
					if (picgp == null) { var backup = errorurl } else { var backup = picgp }
					await komi.sendFileFromUrl(from, backup, 'group.png', 'Backup', id)
					await komi.setGroupIcon(groupId, `data:${mimetype};base64,${mediaData.toString('base64')}`)
				} else if (args.length == 1) {
					if (!isUrl(url)) { await komi.reply(from, mess.nolink(), id) }
					const picgpo = await komi.getProfilePicFromServer(groupId)
					if (picgpo == null) { var back = errorurl } else { var back = picgpo }
					await komi.sendFileFromUrl(from, back, 'group.png', 'Backup', id)
					await komi.setGroupIconByUrl(groupId, url).then(async (r) => (!r && r !== null) ? komi.reply(from, mess.nolink(), id) : komi.reply(from, mess.maked(), id))
				} else return await komi.reply(from, mess.onlyimg(), id)
				break
				
			case 'img':;case 'toimg':
				if (isQuotedSticker) {
					await komi.reply(from, mess.wait(), id)
					const mediaData = await decryptMedia(quotedMsg, uaOverride)
					await komi.sendFile(from, `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`, '', '', id)
				} else return await komi.reply(from, mess.onlyst(), id)
				break
		

			case 'randomanime':
				const nime = await axios.get('https://api.computerfreaker.cf/v1/anime')
				await komi.sendFileFromUrl(from, `${nime.data.url}`, ``, 'e.e', id)
				break
				
			case 'frase':
				const aiquote = await axios.get("http://inspirobot.me/api?generate=true")
				await komi.sendFileFromUrl(from, aiquote.data, 'quote.jpg', '~Ok...?~\n\n❤️', id )
				break
				
			case 'make':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				const diary = await axios.get(`https://st4rz.herokuapp.com/api/nulis?text=${encodeURIComponent(body.slice(6))}`)
				await komi.sendImage(from, `${diary.data.result}`, '', mess.diary(), id)
				break
				
			case 'neko':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				const rnekol = ["kemonomimi", "neko", "ngif", "fox_girl"];
				const rnekolc = rnekol[Math.floor(Math.random() * rnekol.length)];
				const neko = await axios.get('https://nekos.life/api/v2/img/' + rnekolc)
				await komi.sendFileFromUrl(from, `${neko.data.url}`, ``, `🌝`, id)
				break
				
			case 'image':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				const linp = await fetch(`https://api.fdci.se/sosmed/rep.php?gambar=${encodeURIComponent(body.slice(7))}`)
				const pint = await linp.json()
				let erest = pint[Math.floor(Math.random() * pint.length)]
				if (erest == null) return await komi.reply(from, mess.noresult(), id)
				await komi.sendFileFromUrl(from, erest, '', ';)', id)
				break
				
			case 'yaoi':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				const yam = await fetch(`https://api.fdci.se/sosmed/rep.php?gambar=yaoi`)
				const yaoi = await yam.json()
				let flyaoi = yaoi[Math.floor(Math.random() * yaoi.length)]
				if (flyaoi == null) return await komi.reply(from, mess.noresult(), id)
				await komi.sendFileFromUrl(from, flyaoi, '', 'Tururu...', id)
				break
				
			case 'life':
				if (region == 'en') return await komi.reply(from, fmylife, id)
				await sleep(5000)
				await translate(fmylife, region).then(async (lfts) => { await komi.reply(from, lfts, id) })
				break
				
			case 'fox':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				const fox = await axios.get(`https://some-random-api.ml/img/fox`)
				await komi.sendFileFromUrl(from, fox.data.link, ``, 'Olha que fofo🥰', id)
				break
				
			case 'wiki':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				const wikip = await wiki.search(`${body.slice(6)}`, region)
				const wikis = await axios.get(`https://${region}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${wikip[0].pageid}`)
				const getData = Object.keys(wikis.data.query.pages)
				await komi.reply(from, wikis.data.query.pages[getData].extract, id).catch(async () => { await komi.reply(from, mess.noresult(), id) })
				break
				
			case 'nasa':
				const needsTime = args.length !== 0 && args[0].toLowerCase() == '-data' ? `&date=${encodeURIComponent(args[1])}` : '&'
				const nasa = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${config.API_NASA}${needsTime}`)
				if (region == 'en') {
					if (nasa.data.media_type == 'image') {
						await komi.sendFileFromUrl(from, nasa.data.url, '', `\n${nasa.data.date} → ${nasa.data.title}\n\n${nasa.data.explanation}`, id)
					} else return await komi.sendYoutubeLink(from, nasa.data.url, `${nasa.data.date} → ${nasa.data.title}\n\n${nasa.data.explanation}`)
				} else {
					await sleep(4000)
					await translate(nasa.data.explanation, region).then(async (result) => {
						if (nasa.data.media_type == 'image') {
							await komi.sendFileFromUrl(from, nasa.data.url, '', `\n${nasa.data.date} → ${nasa.data.title}\n\n${result}`, id)
						} else return await komi.sendYoutubeLink(from, nasa.data.url, `${nasa.data.date} → ${nasa.data.title}\n\n${result}`)
					})
				}
				break
				
			case 'stalkig':
                case 'stalkinst':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'instagram usernames.', id)
				const ig = await axios.get(`https://www.instagram.com/${encodeURIComponent(body.slice(9))}/?__a=1`)
				const stkig = JSON.stringify(ig.data)
				if (stkig == '{}') return await komi.reply(from, mess.noresult(), id)
				await komi.sendFileFromUrl(from, `${ig.data.graphql.user.profile_pic_url}`, ``, mess.insta(ig), id)
				break
				
			case 'fatos':
				var anifac = ["dog", "cat", "bird", "panda", "fox", "koala"];
				var tsani = anifac[Math.floor(Math.random() * anifac.length)];
				const animl = await axios.get(`https://some-random-api.ml/facts/${tsani}`)
				if (region == 'en') return await komi.reply(from, animl.data.fact, id)
				await sleep(5000)
				await translate(animl.data.fact, 'pt').then(async (result) => { await komi.reply(from, result, id) })
				break
				
			case 'sporn':
				if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
				if (args.length == 0) return await komi.reply(from, mess.noargs(), id)
				const xxxSearch = await XVDL.search(body.slice(7))
				const sPornX = await XVDL.getInfo(xxxSearch.videos[0].url)
				await komi.sendFileFromUrl(from, `${xxxSearch.videos[0].thumbnail.static}`, '', mess.sporn(xxxSearch, sPornX), id)
				break
				
			case 'xvideos':
				if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
				if (args.length == 0 || !isUrl(url) || !url.includes('xvideos.com')) return await komi.reply(from, mess.nolink(), id)
				await komi.reply(from, mess.wait(), id)
				const sPornD = await XVDL.getInfo(url)
				await komi.sendFileFromUrl(from, `${sPornD.streams.lq}`, 'xvideos.mp4', `🌚`, id).catch(async () => { await komi.reply(from, mess.nolink() + '\n\nOu falha geral/or failed on download.', id) })
				break
				
			case 'downvideo':
				if (args.length == 0 || !isUrl(url)) return await komi.reply(from, mess.nolink(), id)
				try {
					await komi.reply(from, mess.wait(), id)
					await youtubedl(`${url}`, { noWarnings: true, noCallHome: true, noCheckCertificate: true, preferFreeFormats: true, youtubeSkipDashManifest: true, referer: `${url}`, getUrl: true, x: true, format: 'mp4', skipDownload: true, matchFilter: `filesize < ${Number(config.Download_Size)}M` }).then(async (video) => { await komi.sendFileFromUrl(from, video, `downloads.mp4`, `e.e`, id) })
				} catch (error) {
					await komi.reply(from, mess.verybig(), id)
					console.log(color('[DOWNVIDEO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'downaudio':
				if (args.length == 0 || !isUrl(url)) return await komi.reply(from, mess.nolink(), id)
				try {
					await komi.reply(from, mess.wait(), id)
					await youtubedl(`${url}`, { noWarnings: true, noCallHome: true, noCheckCertificate: true, preferFreeFormats: true, youtubeSkipDashManifest: true, referer: `${url}`, x: true, audioFormat: 'mp3', o: `./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3` }).then(async () => { await komi.sendPtt(from, `./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3`, id) })
					await sleep(10000).then(async () => { await fs.unlinkSync(`./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3`) })
				} catch (error) {
					await komi.reply(from, mess.verybig(), id)
					if (fs.existsSync(`./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3`)) { await fs.unlinkSync(`./lib/media/audio/d${user.replace('@c.us', '')}${lvpc}.mp3`) }
					console.log(color('[DOWNAUDIO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
		
			case 'video':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Títulos do YouTube', id)
				try {
					await komi.reply(from, mess.wait(), id)
					const vipres = await ytsearch(`${body.slice(7)}`)
					await komi.sendYoutubeLink(from, `${vipres.all[0].url}`, '\n' + mess.play(vipres))
					await youtubedl(`https://www.youtube.com/watch?v=${vipres.all[0].videoId}`, { noWarnings: true, noCallHome: true, noCheckCertificate: true, preferFreeFormats: true, youtubeSkipDashManifest: true, referer: `https://www.youtube.com/watch?v=${vipres.all[0].videoId}`, getUrl: true, x: true, format: 'mp4', skipDownload: true, matchFilter: `filesize < ${Number(config.Download_Size)}M` }).then(async (video) => { await komi.sendFileFromUrl(from, video, `${vipres.all[0].title}.mp4`, `${vipres.all[0].title}`, id) })
				} catch (error) {
					await komi.reply(from, mess.verybig(), id)
					console.log(color('[VIDEO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'ytsearch':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Títulos do YouTube', id)
				await komi.reply(from, mess.wait(), id)
				const ytvrz = await ytsearch(`${body.slice(10)}`)
				await komi.sendYoutubeLink(from, `${ytvrz.all[0].url}`, '\n' + mess.play(ytvrz))
				break
				
			case 'qr':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.sendFileFromUrl(from, `http://api.qrserver.com/v1/create-qr-code/?data=${body.slice(4)}`, '', mess.maked(), id)
				break
				
			case 'readqr':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (isImage || isQuotedImage) {
					const qrCode = isQuotedImage ? quotedMsg : message
					const downQr = await decryptMedia(qrCode, uaOverride)
					const upQrCode = await upload(downQr, false)
					const getQrText = await axios.get(`http://api.qrserver.com/v1/read-qr-code/?fileurl=${upQrCode}`)
					const theQRText = getQrText.data[0].symbol[0].data
					if (theQRText == null) return await komi.reply(from, 'Not a QR - Não é um QR.\n\nOu erro - Or error.', id)
					await komi.reply(from, `→ ${theQRText}`, id).catch(async () => { await komi.reply(from, mess.upfail(), id) })
				} else return await komi.reply(from, mess.onlyimg() + '\nQR-Code!', id)
				break
				
			case 'send':
				if (args.length == 0 || !isUrl(url)) return await komi.reply(from, mess.nolink(), id)
				await komi.sendFileFromUrl(from, url, '', '', id).catch(async () => { await komi.reply(from, mess.onlyimg(), id) })
				break
				
			case 'quote':
				if (args.length <= 1 || !arks.includes('|')) return await komi.reply(from, mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
				await komi.reply(from, mess.wait(), id)
				const quoteimg = await axios.get(`https://terhambar.com/aw/qts/?kata=${encodeURIComponent(arg.split('|')[0])}&author=${encodeURIComponent(arg.split('|')[1])}&tipe=random`)
				await komi.sendFileFromUrl(from, `${quoteimg.data.result}`, '', 'Compreensível.', id)
				break
				
				
		   case 'translate':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'idioma + palavras ou marque a mensagem.', id)
				await komi.reply(from, mess.wait(), id)
				try {
					if (quotedMsg) {
						const quoteText = quotedMsg.type == 'chat' ? quotedMsg.body : quotedMsg.type == 'image' ? quotedMsg.caption : ''
						await sleep(5000)
						await translate(quoteText, args[0]).then(async (result) => { await komi.reply(from, `→ ${result}`, quotedMsgObj.id) })
					} else {
						const txttotl = body.slice(14)
						await sleep(5000)
						await translate(txttotl, args[0]).then(async (result) => { await komi.reply(from, `→ ${result}`, id) })
					}
				} catch (error) {
					await komi.reply(from, mess.ttsiv() + '\n\nOu' + mess.gblock(), id)
					console.log(color('[TRANSLATE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'tts':
				if (args.length <= 1) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				try {
					const dataText = body.slice(8)
					var langtts = args[0]
					if (args[0].toLowerCase() == 'br') langtts = 'pt-br'
					var idptt = tts(langtts)
					await idptt.save(`./lib/media/audio/res${idptt}${lvpc}.mp3`, dataText, async () => {
						await sleep(3000)
						await komi.sendPtt(from, `./lib/media/audio/res${idptt}${lvpc}.mp3`, id)
					})
				} catch (error) { 
					await komi.reply(from, mess.ttsiv(), id)
					console.log(color('[TTS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
	
				case 'amigo':
					if (!isOwner) return await komi.reply(from, 'só o dono', id)
					if (args[0] === 'add') {
						if (mentionedJidList.length !== 0) {
							for (let benet of mentionedJidList) {
								if (benet === botNumber) return await komi.reply(from, '?', id)
								_amigo.push(benet)
								fs.writeFileSync('./database/bot/amigos.json', JSON.stringify(_amigo))
							}
							await komi.reply(from, "pronto", id)
						} else {
							_amigo.push(args[1] + '@c.us')
							fs.writeFileSync('./database/bot/amigos.json', JSON.stringify(_amigo))
							await komi.reply(from, "pronto", id)
						}
					} else if (args[0] === 'del') {
						if (mentionedJidList.length !== 0) {
							if (mentionedJidList[0] === botNumber) return await komi.reply(from, '?', id)
							_amigo.splice(mentionedJidList[0], 1)
							fs.writeFileSync('./database/bot/amigos.json', JSON.stringify(_amigo))
							await komi.reply(from, 'pronto', id)
						} else{
							_amigo.splice(args[1] + '@c.us', 1)
							fs.writeFileSync('./database/bot/amigos.json', JSON.stringify(_amigo))
							await komi.reply(from, 'pronto', id)
						}
					} else {
						await komi.reply(from, `/amigo add numero`, id)
					}
				break

				
			case 'idiomas':
				await komi.reply(from, mess.idiomas(), id)
				break
				
			case 'resposta':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${body.slice(10)}`)
				await komi.reply(from, mess.maked(), id)
				break
				
			case 'criador':
				await komi.reply(from, `Wa.me/559887053394`, id)
			//	await komi.reply(from, mess.everhost(), id)
				break
				
			case 'akinator':;case 'aki':
				try {
					if (args[0].toLowerCase() == '-r') {
						let akinm = args[1].match(/^[0-9]+$/)
						if (!akinm) return await komi.reply(from, mess.aki(), id)
						const myAnswer = `${args[1]}`
						await aki.step(myAnswer);
						jogadas = jogadas + 1
						if (aki.progress >= 90 || aki.currentStep >= 90) {
							await aki.win()
							var akiwon = aki.answers[0]
							await komi.sendFileFromUrl(from, `${akiwon.absolute_picture_path}`, '', mess.akiwon(aki, akiwon), id)
						} else { await komi.reply(from, mess.akistart(aki), id) }
					} else if (args[0].toLowerCase() == '-back' || args[0].toLowerCase() == '-new') {
						for (let i = 0; i < jogadas; i++) { await aki.back() }
						jogadas = 0
						await komi.reply(from, mess.akistart(aki), id)
					} else return await komi.reply(from, mess.akistart(aki), id)
				} catch (error) {
					await komi.reply(from, mess.akifail(), id)
					akinit()
					await komi.reply(from, mess.akistart(aki), id)
					console.log(color('[AKINATOR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			// Se quiser adicione respostas na reply.txt ou use o comando '/resposta', Íris também consegue adicionar ela mesma sozinha
			case 'bot': case 'simi':
				if (args.length == 0) return await komi.reply(from, chatBotR, id)
				try {
					if (args[0].toLowerCase() == '-g') {
						await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" reply.txt | shuf -n 1'`, async (error, stdout, stderr) => {
							if (error || stderr || stdout == null || stdout == '') {
								await komi.reply(from, chatBotR, id)
							} else return await komi.reply(from, stdout, id)
						})
					} else {
						const komi = await axios.get(`https://api-exteam.herokuapp.com/api/simi-simi?texto=${encodeURIComponent(body.slice(6))}&lingua=${region}`)
						if (komi.data.success == 'Limit 50 queries per hour.' || komi.data.success == '' || komi.data.success == null) {
							await komi.reply(from, chatBotR, id)
						} else {
							//if (komi.data.success == 'Curta a pagina Gamadas por Bieber no facebook ;)') return await komi.reply(from, 'Oi sua gostosa, como vai?', id)
							await komi.reply(from, komi.data.success, id)
							await fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${komi.data.success}`)
						}
					}
				} catch (error) { 
					await komi.reply(from, chatBotR, id)
					console.log(color('[komi]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'speak':
				const sppt = require('node-gtts')(region);const speakttplc = `./lib/media/audio/resPtm${lvpc}.mp3`
				if (args.length == 0) return await sppt.save(speakttplc, chatBotR, async function () { await komi.sendPtt(from, speakttplc, id) })
				try {
					if (args[0].toLowerCase() == '-g') {
						await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" reply.txt | shuf -n 1'`, async (error, stdout, stderr) => {
							if (error || stderr || stdout == null || stdout == '') {
								await sppt.save(speakttplc, chatBotR, async function () { await komi.sendPtt(from, speakttplc, id) })
							} else { await sppt.save(speakttplc, stdout, async function () { await komi.sendPtt(from, speakttplc, id) }) }
						})
					} else {
						const spkomi = await axios.get(`http://simsumi.herokuapp.com/api?text=${encodeURIComponent(body.slice(7))}&lang=${region}`)
						const a = spkomi.data.success
						if (a == 'Limit 50 queries per hour.' || a == '' || a == null) {
							await sppt.save(speakttplc, chatBotR, async function () { await komi.sendPtt(from, speakttplc, id) })
						} else {
							await sppt.save(speakttplc, a, async function () {
								await komi.sendPtt(from, speakttplc, id)
								await fs.appendFile('./lib/config/Utilidades/reply.txt', `\n${a}`)
							})
						}
					}
				} catch (error) {
					await sppt.save(speakttplc, chatBotR, async function () { await komi.sendPtt(from, speakttplc, id) })
					console.log(color('[SPEAK]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'curiosidade':
				try {
					if (args[0].toLowerCase() == '-g') {
						await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" curiosidades.txt | shuf -n 1'`, async (error, stdout, stderr) => {
							if (error || stderr || stdout == null || stdout == '') {
								await komi.reply(from, thiskomiCats, id)
							} else return await komi.reply(from, stdout, id)
						})
					} else return await komi.reply(from, thiskomiCats, id)
				} catch (error) { 
					await komi.reply(from, thiskomiCats, id)
					console.log(color('[CURIOSIDADE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'trecho':
				try {
					if (args[0].toLowerCase() == '-g') {
						await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${args[1]}" frases.txt | shuf -n 1'`, async (error, stdout, stderr) => {
							if (error || stderr || stdout == null || stdout == '') {
								await komi.reply(from, theCitacion, id)
							} else return await komi.reply(from, stdout, id)
						})
					} else return await komi.reply(from, theCitacion, id)
				} catch (error) { 
					await komi.reply(from, theCitacion, id)
					console.log(color('[TRECHO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'roll':
				const dice = Math.floor(Math.random() * 6) + 1
				await komi.sendStickerfromUrl(from, 'https://www.random.org/dice/dice' + dice + '.png', { method: 'get' }, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'rolette':;case 'roleta':
				if (!isxp) return await komi.reply(from, mess.needxpon(), id)
				const limitrl = await gaming.getLimit(user, daily);if (gaming.isLimit(limitrl) == 1) return await komi.reply(from, mess.limitgame(), id)
				const checkxpr = await gaming.getValue(user, nivel, 'xp');const xpMenorT = parseInt(checkxpr / 2, 10)
				if (isNaN(args[0]) || !isInt(args[0]) || Number(args[0]) >= xpMenorT || Number(args[0]) < 250) return await komi.reply(from, mess.gaming(checkxpr, xpMenorT), id)
				var nrolxp = Math.floor(Math.random() * -milSort) - Number(args[0]);var prolxp = Math.floor(Math.random() * milSort) + Number(args[0])
				side == 1 ? await komi.sendFileFromUrl(from, 'https://i.ibb.co/vQj6nq4/roleta1.png', 'rol1.png', mess.loseshot(nrolxp), id) : await komi.sendFileFromUrl(from, 'https://i.ibb.co/PwKR2nR/roleta.jpg', 'rol.jpg', mess.winshot(prolxp), id)
				side == 1 ? await gaming.addValue(user, Number(nrolxp), nivel, 'xp') : await gaming.addValue(user, Number(prolxp), nivel, 'xp')
				if (noLimits == 0) await gaming.addLimit(user, daily, './lib/config/Gerais/diario.json')
				break
				
			case 'flip':
				if (!isxp) return await komi.reply(from, mess.needxpon(), id)
				const limitfp = await gaming.getLimit(user, daily);if (gaming.isLimit(limitfp) == 1) return await komi.reply(from, mess.limitgame(), id)
				const checkxp = await gaming.getValue(user, nivel, 'xp');const xpMenorc = parseInt(checkxp / 2, 10)
				if (isNaN(args[1]) || !isInt(args[1]) || Number(args[1]) >= xpMenorc || Number(args[1]) < 250) return await komi.reply(from, mess.gaming(checkxp, xpMenorc), id)
				var nflipxp = Math.floor(Math.random() * -milSort) - Number(args[1]);var pflipxp = Math.floor(Math.random() * milSort) + Number(args[1])
				if (args[0].toLowerCase() == 'cara' || args[0].toLowerCase() == 'coroa') {
					if (side == 1) { await komi.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png', { method: 'get' }, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true }) } else { await komi.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png', { method: 'get' }, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true }) }
					if (args[0].toLowerCase() == 'cara' && side == 1) {
						await komi.reply(from, mess.flipwin(pflipxp) + ' "cara".', id)
						await gaming.addValue(user, Number(pflipxp), nivel, 'xp')
					} else if (args[0].toLowerCase() == 'coroa' && side == 2) {
						await komi.reply(from, mess.flipwin(pflipxp) + ' "coroa".', id)
						await gaming.addValue(user, Number(pflipxp), nivel, 'xp')
					} else { await komi.reply(from, mess.fliplose(nflipxp) + ` "${args[0].toLowerCase()}".`, id);await gaming.addValue(user, Number(nflipxp), nivel, 'xp') }
				} else return await komi.reply(from, mess.fliphow(), id)
				if (noLimits == 0) await gaming.addLimit(user, daily, './lib/config/Gerais/diario.json')
				break
				
			case 'cassino':
				if (!isxp) return await komi.reply(from, mess.needxpon(), id)
				const limitcs = await gaming.getLimit(user, daily)
				// (gaming.isLimit(limitcs) == 1) return await komi.reply(from, mess.limitgame(), id)
				var checkxpc = await gaming.getValue(user, nivel, 'xp')
				const xpMenor = parseInt(checkxpc / 2, 10)
				if (isNaN(args[0]) || !isInt(args[0]) || Number(args[0]) >= xpMenor || Number(args[0]) < 250) return await komi.reply(from, mess.gaming(checkxpc, xpMenor), id)
				var pcasxp = Math.floor(Math.random() * milSort) + Number(args[0])
				var cassin = ['- 🍒 ', '- 🎃 ', '- 🍐 ']
				var cassinend = valueRand(cassin) + valueRand(cassin) + valueRand(cassin) + '-'
				if (cassinend == '- 🍒 - 🍒 - 🍒 -' || cassinend == '- 🍐 - 🍐 - 🍐 -' || cassinend == '- 🎃 - 🎃 - 🎃 -') { await gaming.addValue(user, Number(pcasxp), nivel, 'xp');await komi.reply(from, mess.caswin(cassinend, Number(pcasxp)), id) } else { await gaming.addValue(user, Number(-pcasxp), nivel, 'xp');await komi.reply(from, mess.caslose(cassinend, Number(-pcasxp)), id) }
				if (noLimits == 0) await gaming.addLimit(user, daily, './lib/config/Gerais/diario.json')
				break
				
				
		   case 'poll':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await poll.get(komi, message, pollfile, voterslistfile).catch(async (error) => { console.log(error);await komi.reply(from, '0 votações abertas.', id) })
				break	 
				
				
		   case 'vote':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await poll.vote(komi, message, pollfile, voterslistfile).catch(async (error) => { console.log(error);await komi.reply(from, '0 votações abertas.', id) })
				break
				
				
		   case 'newpoll':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await poll.resetp(komi, message, message.body.slice(9), pollfile, voterslistfile)
				break
				
				
		   case 'ins':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await poll.add(komi, message, body.slice(5), pollfile, voterslistfile).catch(async (error) => { console.log(error);await komi.reply(from, '0 votações abertas.', id) })
				break
				
			case 'nsfw':
				if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].nsfw.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].nsfw.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].nsfw.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].nsfw.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else if (isGroupMsg) {
					await komi.reply(from, mess.soademiro(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'welcome':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].welcome.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].welcome.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].welcome.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].welcome.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else if (isGroupMsg) {
					await komi.reply(from, mess.soademiro(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'macaco':
				await axios.get("https://api.fdci.se/sosmed/rep.php?gambar=macaco").then(async (result) => {
					var mon = JSON.parse(JSON.stringify(result.data))
					var nkey = mon[Math.floor(Math.random() * mon.length)]
					if (nkey == null) return await komi.reply(from, mess.noresult(), id)
					await komi.sendFileFromUrl(from, nkey, "", "🙏 🙏 🙏", id)
				})
				break
				
			case 'ball':
				const ball = await axios.get('https://nekos.life/api/v2/img/8ball')
				await komi.sendStickerfromUrl(from, ball.data.url, { method: 'get' }, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'cafune':
				const rcafune = ["pat", "cuddle", "poke"];
				const rcafulc = rcafune[Math.floor(Math.random() * rcafune.length)];
				const cfnean = await axios.get('https://nekos.life/api/v2/img/' + rcafulc)
				await komi.sendStickerfromUrl(from, cfnean.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'quack':
				case 'pato':
				const patu = await axios.get('https://nekos.life/api/v2/img/goose')
				await komi.sendFileFromUrl(from, patu.data.url, '', '', id)
				break
				
			case 'poke':
				const pokean = await axios.get('https://nekos.life/api/v2/img/poke')
				await komi.sendStickerfromUrl(from, pokean.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'cocegas':
				const cocegas = await axios.get('https://nekos.life/api/v2/img/tickle')
				await komi.sendStickerfromUrl(from, cocegas.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'food':
				const feed = await axios.get('https://nekos.life/api/v2/img/tickle')
				await komi.sendStickerfromUrl(from, feed.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'baka':
				const baka = await axios.get('https://nekos.life/api/v2/img/baka')
				await komi.sendStickerfromUrl(from, baka.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'lizard':
				const lizard = await axios.get('https://nekos.life/api/v2/img/lizard')
				await komi.sendFileFromUrl(from, lizard.data.url, '', '', id)
				break
				

			case 'google':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.reply(from, mess.wait(), id)
				await google({ 'query': body.slice(8) }).then(async (results) => {
					let vars = `🔎 「 ${body.slice(8)} 」 🔎\n`
					for (let i = 0; i < results.length; i++) { vars += `\n═════════════════\n→ ${results[i].title}\n\n→ ${results[i].snippet}\n\n→ ${results[i].link}` }
					await komi.reply(from, vars, id)
				}).catch(async () => { await komi.reply(from, mess.gblock(), id) })
				break
				
				
		   case 'clima':
			if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
		//	if (limit.isLimit(sender.id, _limit, limitCount, isPremium, isOwner)) return await komi.reply(from, 'Seu limite acabou', id)
			limit.addLimit(sender.id, _limit, isPremium, isOwner)
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nomes da cidade', id)
				const clima = await axios.get(`https://pt.wttr.in/${encodeURIComponent(body.slice(7))}?format=Cidade%20=%20%l+\n\nEstado%20=%20%C+%c+\n\nTemperatura%20=%20%t+\n\nUmidade%20=%20%h\n\nVento%20=%20%w\n\nLua agora%20=%20%m\n\nNascer%20do%20Sol%20=%20%S\n\nPor%20do%20Sol%20=%20%s`)
				await komi.sendFileFromUrl(from, `https://wttr.in/${encodeURIComponent(body.slice(7))}.png`, '', mess.wttr(clima), id)
				break
				
			case 'boy':
				var hite = ["eboy", "garoto", "homem", "men", "garoto oriental", "japanese men", "pretty guy", "homem bonito"];
				var hesc = hite[Math.floor(Math.random() * hite.length)];
				var men = "https://api.fdci.se/sosmed/rep.php?gambar=" + hesc;
				await axios.get(men).then(async (result) => {
					var h = JSON.parse(JSON.stringify(result.data))
					var cewek =	 h[Math.floor(Math.random() * h.length)]
					if (cewek == null) return await komi.reply(from, mess.noresult(), id)
					await komi.sendFileFromUrl(from, cewek, "result.jpg", "👨🏻", id)
				})
				break
				
			case 'aptoide':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Nome do App', id)
				const aptoide = await axios.get(`http://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(body.slice(9))}&trusted=true`)
				if (aptoide.data.datalist.total == 0) return await komi.reply(from, mess.noresult(), id)
				const getApk = aptoide.data.datalist.list[0]
				const sizeApk = (getApk.size / 1048576).toFixed(1)
				await komi.sendFileFromUrl(from, `${getApk.graphic}`, 'aptoide.png', mess.aptoide(getApk, sizeApk), id)
				break
				
			case 'girl':
				var items = ["garota adolescente", "saycay", "alina nikitina", "belle delphine", "teen girl", "teen cute", "japanese girl", "garota bonita oriental", "oriental girl", "korean girl", "chinese girl", "teen egirl", "brazilian teen girl", "pretty teen girl", "korean teen girl", "garota adolescente bonita", "menina adolescente bonita", "egirl", "cute girl"];var cewe = items[Math.floor(Math.random() * items.length)]
				await axios.get(`https://api.fdci.se/sosmed/rep.php?gambar=${cewe}`).then(async (result) => {
					var b = JSON.parse(JSON.stringify(result.data));
					var cewek =	 b[Math.floor(Math.random() * b.length)];
					if (cewek == null) return await komi.reply(from, mess.noresult(), id)
					await komi.sendFileFromUrl(from, cewek, "result.jpg", "😍", id)
				})
				break
				
			case 'anime':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome do anime', id)
				const getAnime = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(body.slice(7))}&limit=1`)
				if (getAnime.data.status == 404 || getAnime.data.results[0] == '') return await komi.sendFileFromUrl(from, errorurl, 'error.png', mess.noresult())
				if (region == 'en') return await komi.sendFileFromUrl(from, `${getAnime.data.results[0].image_url}`, 'anime.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getAnime.data.results[0].title}\n\n🎆️ *Episode:* ${getAnime.data.results[0].episodes}\n\n💌️ *Rating:* ${getAnime.data.results[0].rated}\n\n❤️ *Note:* ${getAnime.data.results[0].score}\n\n💚️ *Synopsis:* ${getAnime.data.results[0].synopsis}\n\n🌐️ *Link*: ${getAnime.data.results[0].url}`, id)
				await sleep(5000)
				await translate(getAnime.data.results[0].synopsis, region).then(async (syno) => { await komi.sendFileFromUrl(from, `${getAnime.data.results[0].image_url}`, 'anime.jpg', mess.getanime(syno, getAnime), id) })
				break
				
			case 'manga':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome do manga.', id)
				const getManga = await axios.get(`https://api.jikan.moe/v3/search/manga?q=${encodeURIComponent(body.slice(7))}&limit=1`)
				if (getManga.data.status == 404 || getManga.data.results[0] == '') return await komi.sendFileFromUrl(from, errorurl, 'error.png', mess.noresult())
				if (region == 'en') return await komi.sendFileFromUrl(from, `${getManga.data.results[0].image_url}`, 'manga.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getManga.data.results[0].title}\n\n🎆️ *Chapters:* ${getManga.data.results[0].chapters}\n\n💌️ *Volumes:* ${getManga.data.results[0].volumes}\n\n❤️ *Note:* ${getManga.data.results[0].score}\n\n💚️ *Synopsis:* ${getManga.data.results[0].synopsis}\n\n🌐️ *Link*: ${getManga.data.results[0].url}`, id)
				await sleep(5000)
				await translate(getManga.data.results[0].synopsis, region).then(async (syno) => { await komi.sendFileFromUrl(from, `${getManga.data.results[0].image_url}`, 'manga.jpg', mess.getmanga(syno, getManga), id) })
				break
				
			case 'nh':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
				if (args.length == 1) {
					await komi.reply(from, mess.wait(), id)
					const cek = await nhentai.exists(args[0])
					if (cek == true)  {
						const api = new API()
						const pic = await api.getBook(args[0]).then(book => { return api.getImageURL(book.cover) })
						const dojin = await nhentai.getDoujin(args[0])
						const { title, details, link } = dojin
						const { parodies, tags, artists, groups, languages, categories } = await details
						await komi.sendFileFromUrl(from, pic, '', mess.nhentai(title, parodies, tags, artists, groups, languages, categories, link), id)
						await komi.sendFileFromUrl(from, `https://nhder.herokuapp.com/download/nhentai/${args[0]}/zip`, 'hentai.zip', '', id).catch(async () => { await komi.reply(from, 'Failed at download hentai.', id) })
					} else return await komi.reply(from, mess.noresult(), id) 
				} else return await komi.reply(from, mess.noargs() + '6 digit/digitos (code/código nhentai) (ex: 215600).', id)
				break
				
			case 'profile':;case 'perfil':;case 'me':
				if (isGroupMsg) {
					if (mentionedJidList.length !== 0) menUser = await komi.getContact(mentionedJidList[0])
					await komi.reply(from, mess.wait(), id)
					var qmid = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? menUser.id : user)
					const peoXp = await gaming.getValue(qmid, nivel, 'xp')
					const myMsg = await gaming.getValue(qmid, nivel, 'msg')
					const peoLevel = await gaming.getValue(qmid, nivel, 'level')
					const thecoinqtd = await gaming.getValue(qmid, nivel, 'coin')
					var pic = await komi.getProfilePicFromServer(qmid)
					var namae = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? menUser.pushname : pushname)
					var sts = await komi.getStatus(qmid)
					var adm = groupAdmins.includes(qmid) ? 'Sim' : 'Não'
					var muted = functions[0].silence.includes(qmid) ? 'Sim' : 'Não'
					var blocked = blockNumber.includes(qmid) ? 'Sim' : 'Não'
					var { status } = sts;status == '' || status == '401' ? status = '' : status = `\n\n💌️ *Frase do recado?*\n${status}`
					if (pic == null || typeof pic === 'object') { var pfp = errorurl } else { var pfp = pic }
					var playerRole = await gaming.getPatent(peoLevel)
					var customRec = '';var GodkomisToo = '';var fuckALLife = '';var getGirlfriend = '';var myGuild = '';var stateOrigin = '\n\n👪 *Clã:* '
					if (region == 'en') { fuckALLife = fmylife;GodkomisToo = randomBible;getGirlfriend = getHappyness } else {
						await translate(randomBible, region).then((bibles) => { GodkomisToo = bibles })
						await translate(fmylife, region).then((lifes) => { fuckALLife = lifes })
						await translate(getHappyness, region).then((love) => { getGirlfriend = love })
					}
					if (functions[0].thieves.includes(qmid)) { myGuild = '\n\n⚔️ *Guilda:* Thieves' } else if (functions[0].companions.includes(qmid)) { myGuild = '\n\n⚔️ *Guilda:* Companions' }
					const statesgp = await komi.getAllGroups()
					for (let ids of statesgp) { const chatPersons = await komi.getGroupMembersId(`${ids.contact.id}`);if (chatPersons.includes(qmid)) { const groupInfo = await komi.getGroupInfo(`${ids.contact.id}`);stateOrigin += `\n➸ ${groupInfo.title}` } }
					Object.keys(custom).forEach((i) => { if (custom[i].user == qmid) { customRec = `\n\n🌟 *Nota:* ${custom[i].msg}` } })
					await komi.sendFileFromUrl(from, pfp, 'pfo.jpg', mess.profile(namae, myMsg, adm, muted, blocked, status, peoLevel, peoXp, getReqXP(peoLevel), playerRole) + `\n\n💴 *Í-Coin*: ${thecoinqtd}\n\n🏷️ *TAG:* #${theTagPorn}‎\n\n❇️ *Arma:* ${whatWeapon}‎\n\n📢 *Inspire-se:* ${theCitacion}‎\n\n💡 *Aprenda:* ${thiskomiCats}‎\n\n🐏 *Versículo:* ${GodkomisToo}\n\n🔮 *Futuro:* ${fuckALLife}‎\n\n🌺 *Cantada:* ${getGirlfriend}\n\n🐂 *Tipo:* ${howGado}‎` + customRec + myGuild + stateOrigin, id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'brainly':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'preguntas', id)
				const question = body.slice(9)
				if (args.length >= 10) return await komi.reply(from, mess.tenargs(), id)
				var langbl = region
				if (langbl == 'en') langbl = 'us'
				await brainly(question, 1, region).then(async (res) => {
					if (res.message == 'Data not found') return await komi.reply(from, mess.noresult(), id)
					await komi.reply(from, mess.brainlyres(res), id)
				})
				break
				
			case 'store':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Nome do App', id)
				await komi.reply(from, mess.wait(), id)
				await sleep(5000)
				const stsp = await search(`${body.slice(7)}`)
				if (region == 'en') return await komi.sendFileFromUrl(from, stsp.icon, '', `*Name >* ${stsp.name}\n\n*Link >* ${stsp.url}\n\n*Price >* ${stsp.price}\n\n*Description >* ${stsp.description}\n\n*Rating >* ${stsp.rating}/5\n\n*Developer >* ${stsp.developer.name}\n\n*Others >* ${stsp.developer.url}`, id)
				await sleep(5000)
				await translate(stsp.description, region).then(async (playst) => { await komi.sendFileFromUrl(from, stsp.icon, '', mess.store(stsp, playst), id) })
				break
				
			case 'search':
				if (isImage || isQuotedImage) {
					const tMData = isQuotedImage ? quotedMsg : message
					const mediaData = await decryptMedia(tMData, uaOverride)
					await komi.reply(from, mess.searchanime(), id)
					await fetch('https://trace.moe/api/search', { method: 'POST', body: JSON.stringify({ image: `data:${mimetype};base64,${mediaData.toString('base64')}` }), headers: { "Content-Type": "application/json" } }).then(respon => respon.json()).then(async (resolt) => {
						if (resolt.docs && resolt.docs.length <= 0) { await komi.reply(from, mess.noresult(), id) }
						const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
						teks = ''
						if (similarity < 0.90) { teks = '*Not sure/Não tenho certeza/No estoy segura...* :\n\n' }
						teks += mess.sanimetk(title, title_chinese, title_romaji, title_english, is_adult, episode, similarity)
						var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
						await komi.sendFileFromUrl(from, video, 'nimek.mp4', teks, id).catch(async () => { await komi.reply(from, teks, id) })
					})
				} else return await komi.sendFileFromUrl(from, errorurl, 'error.png', mess.searchanime() + '\n\n' + mess.onlyimg())
				break
				
			case 'link':
				if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
				if (!isGroupAdmins) return await komi.reply(from, mess.soademiro(), id)
				if (isGroupMsg) {
					const inviteLink = await komi.getGroupInviteLink(groupId);
					await komi.sendLinkWithAutoPreview(from, inviteLink, `❤️ - ${name}`)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'broad':; case 'tm':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				if (args.length == 0) return await komi.reply(from, mess.broad(), id)
				const chatall = await komi.getAllChatIds()
				const isGroupC = await chatall.filter(group => group.includes('@g.us'))
				const isPrivateC = await chatall.filter(privat => privat.includes('@c.us'))
				try {
					const sendQFileC = async (quotedMsgObj, ids) => {
						let replyOnReply = await komi.getMessageById(quotedMsgObj.id)
						let obj = replyOnReply.quotedMsgObj
						if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
							if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
						} else if (obj && /ptt|audio|video|image/.test(obj.type)) { quotedMsgObj = obj } else return
						const mediaData = await decryptMedia(quotedMsgObj)
						await komi.sendFile(ids, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', `Enviado pelo Dono.`)
					}
					let msg = body.slice(12)
					if (args[0].toLowerCase() == '-all') {
						for (let ids of chatall) {
							var cvk = await komi.getChatById(ids)
							if (!cvk.isReadOnly) {
								try {
									await komi.sendText(ids, `[Transmissão de ${pushname} ]\n\n${msg}`)
									if (quotedMsgObj) { await sendQFileC(quotedMsgObj, ids) }
								} catch (error) { console.log(color('[BROADCAST]', 'crimson'), color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold')) }
							}
						}
						await komi.reply(from, mess.maked(), id)
					} else if (args[0].toLowerCase() == '-gps') {
						for (let ids of isGroupC) {
							var cvk = await komi.getChatById(ids)
							if (!cvk.isReadOnly) {
								try {
									await komi.sendText(ids, `[Transmissão de ${pushname} ]\n\n${msg}`)
									if (quotedMsgObj) { await sendQFileC(quotedMsgObj, ids) }
								} catch (error) { console.log(color('[BROADCAST]', 'crimson'), color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold')) }
							}
						}
						await komi.reply(from, mess.maked(), id)
					} else if (args[0].toLowerCase() == '-pvs') {
						for (let ids of isPrivateC) {
							try {
								await komi.sendText(ids, `[Transmissão de ${pushname} ]\n\n${msg}`)
								if (quotedMsgObj) { await sendQFileC(quotedMsgObj, ids) }
							} catch (error) { console.log(color('[BROADCAST]', 'crimson'), color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold')) }
						}
						await komi.reply(from, mess.maked(), id)
					} else return await komi.reply(from, mess.broad(), id)
				} catch (error) {
					await komi.reply(from, mess.noctt(), id)
					console.log(color('[BROADCAST]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'ptt':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (quotedMsgObj) {
					let replyOnReply = await komi.getMessageById(quotedMsgObj.id)
					let obj = replyOnReply.quotedMsgObj
					if (/ptt|audio/.test(quotedMsgObj.type)) {
						if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
					} else if (obj && /ptt|audio/.test(obj.type)) { quotedMsgObj = obj } else return
					const mediaData = await decryptMedia(quotedMsgObj)
					await komi.sendPtt(from, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', id)
				} else komi.reply(from, mess.onlyaudio(), id)
				break
				
			case 'get':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (quotedMsgObj) {
					let replyOnReply = await komi.getMessageById(quotedMsgObj.id)
					let obj = replyOnReply.quotedMsgObj
					if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
						if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
					} else if (obj && /ptt|audio|video|image/.test(obj.type)) { quotedMsgObj = obj } else return
					const mediaData = await decryptMedia(quotedMsgObj)
					await komi.sendFile(from, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', '')
				} else komi.reply(from, mess.onlymidia(), id)
				break
				
			case 'adms':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				let mimin = ''
				for (let admon of groupAdmins) { mimin += `➸ @${admon.replace(/@c.us/g, '')}\n` }
				await sleep(2000)
				await komi.sendTextWithMentions(from, mimin)
				break
				
			case 'groupinfo':;case 'info':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				var totalMem = chat.groupMetadata.participants.length
				var desc = chat.groupMetadata.desc
				var groupname = name
				let admgp = ''
				for (let admon of groupAdmins) {
					var adminsls = await komi.getContact(admon)
					var getAdmsLst = adminsls.pushname
					if (getAdmsLst == null) getAdmsLst = 'wa.me/' + admon.replace(/@c.us/g, '')
					admgp += `➸ ${getAdmsLst}\n`
				}
				var donodeGp = await komi.getContact(chat.groupMetadata.owner)
				var gpOwner = donodeGp == null ? '??? - Top secret name - ???' : donodeGp.pushname == null ? `wa.me/${chat.groupMetadata.owner.replace('@c.us', '')}` : donodeGp.pushname
				var welgrp = functions[0].welcome.includes(groupId) ? 'Sim' : 'Não'
				var fakegp = functions[0].fake.includes(groupId) ? 'Sim' : 'Não'
				var bklistgp = functions[0].blacklist.includes(groupId) ? 'Sim' : 'Não'
				var xpgp = functions[0].xp.includes(groupId) ? 'Sim' : 'Não'
				var slcegp = functions[0].silence.includes(groupId) ? 'Sim' : 'Não'
				var ngrp = functions[0].nsfw.includes(groupId) ? 'Sim' : 'Não'
				var autostk = functions[0].sticker.includes(groupId) ? 'Sim' : 'Não'
				var atpngy = functions[0].antiporn.includes(groupId) ? 'Sim' : 'Não'
				var atlka = functions[0].antilinks.includes(groupId) ? 'Sim' : 'Não'
				var anttra = functions[0].antitrava.includes(groupId) ? 'Sim' : 'Não'
				var grouppic = await komi.getProfilePicFromServer(groupId)
				if (grouppic == null || typeof grouppic === 'object') { var pfp = errorurl } else { var pfp = grouppic }
				await komi.sendFileFromUrl(from, pfp, 'group.png', mess.groupinfo(groupname, totalMem, welgrp, atpngy, atlka, anttra, xpgp, fakegp, bklistgp, slcegp, autostk, ngrp, desc, gpOwner, admgp), id)
				break
				
			case 'chefe':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await komi.sendTextWithMentions(from, `👉 @${chat.groupMetadata.owner}`)
				break
				
			case 'wame':
				if (quotedMsg) {
					await komi.reply(from, `📞 - https://wa.me/${quotedMsgObj.sender.id.replace('@c.us', '')} - ${quotedMsgObj.sender.id.replace('@c.us', '')}`, id)
				} else if (mentionedJidList.length !== 0) {
					var wame = ''
					for (let i = 0; i < mentionedJidList.length; i++) { wame += `\n📞 - https://wa.me/${mentionedJidList[i].replace('@c.us', '')} - @${mentionedJidList[i].replace('@c.us', '')}` }
					await komi.sendTextWithMentions(from, wame, id)
				} else return await komi.reply(from, `📞 - https://wa.me/${user.replace('@c.us', '')} - ${user.replace('@c.us', '')}`, id)
				break
				
			case 'maps':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nomes de cidade.', id)
				const mapz2 = await axios.get(`https://mnazria.herokuapp.com/api/maps?search=${encodeURIComponent(body.slice(6))}`)
				const { gambar } = mapz2.data
				const pictk = await bent("buffer")(gambar)
				await komi.sendImage(from, `data:image/jpg;base64,${pictk.toString("base64")}`, 'maps.jpg', `*📍 ${body.slice(6)}*`)
				break
				
			case 'sip':
				if (args.length !== 1) return await komi.reply(from, mess.noargs() + 'IPV4 (ex: 8.8.8.8).', id)
				const ip = await axios.get(`http://ipwhois.app/json/${encodeURIComponent(body.slice(5))}`)
				if (ip.data.latitude == null) return await komi.reply(from, mess.noresult(), id)
				await komi.sendLocation(from, `${ip.data.latitude}`, `${ip.data.longitude}`, '')
				await komi.reply(from, mess.sip(ip), id)
				await komi.reply(from, 'Searching place photo - Buscando foto do local...\nEspere - Wait...\n+20S...', id)
				const browserip = await puppeteer.launch(options)
				const pageip = await browserip.newPage()
				await pageip.goto(`http://www.google.com/maps?layer=c&cbll=${ip.data.latitude},${ip.data.longitude}`, { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
					await sleep(20000)
					await pageip.screenshot({path: `./lib/media/img/${user.replace('@c.us', '')}ip.png`})
					await browserip.close()
				})
				await komi.sendFile(from, `./lib/media/img/${user.replace('@c.us', '')}ip.png`, 'ip.png', 'Maybe here - Talvez aqui! 📍', id)
				await sleep(10000).then(async () => { await fs.unlinkSync(`./lib/media/img/${user.replace('@c.us', '')}ip.png`) })
				break
				
			case 'scep':
					if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (!region == 'pt') return await komi.reply(from, 'Brazil only/Brasil solamente!', id)
				if (args.length !== 1) return await komi.reply(from, mess.noargs() + 'CEP (ex: 03624090).', id)
				const cep = await axios.get(`https://viacep.com.br/ws/${encodeURIComponent(body.slice(6))}/json/`)
				await komi.reply(from, mess.scep(cep), id)
				break
				
			case 'everyone':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					let hehe = `═✪〘 🖊️ - ${body.slice(10)} - 🐂 〙✪═\n\n`
					for (let i = 0; i < groupMembers.length; i++) { hehe += `- @${groupMembers[i].id.replace(/@c.us/g, '')}\n` }
					hehe += '\n═✪〘 ❤️ - KOMI-BOT - 📢 〙✪═'
					await sleep(2000)
					await komi.sendTextWithMentions(from, hehe)
				} else if (isGroupMsg) {
					await komi.reply(from, mess.soademiro(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'random':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				await komi.sendTextWithMentions(from, `═✪〘 👉 - ${body.slice(8)} - 🐂 〙✪═ \n\n @${randomMember.replace(/@c.us/g, '')}`)
				await sleep(2000)
				break
				
			case 'arquivar':
				if (isGroupMsg) {
					const groupOwner = user === chat.groupMetadata.owner
					if (groupOwner || isOwner) {
						if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
						for (let i = 0; i < groupMembers.length; i++) {
							if (groupAdmins.includes(groupMembers[i].id) || ownerNumber.includes(groupMembers[i].id)) {
								console.log(color('[VIP] - ', 'crimson'), groupMembers[i].id)
							} else { await komi.removeParticipant(groupId, groupMembers[i].id) }
						}
						await komi.reply(from, mess.maked(), id)
					} else return await komi.reply(from, mess.gpowner(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'leave':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				const allGroups = await komi.getAllGroups()
				for (let gclist of allGroups) {
					await komi.sendText(gclist.contact.id, mess.goodbye())
					await komi.leaveGroup(gclist.contact.id)
				}
				await komi.reply(from, mess.maked(), id)
				break
				
			case 'clear':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				const allChatz = await komi.getAllChats()
				for (let dchat of allChatz) { await komi.clearChat(dchat.id) } // Se quiser deletar os chats, use 'await komi.deleteChat(dchat.id)', mas cuidado com fake, welcome, blacklist e outros.
				await komi.reply(from, mess.maked(), id)
				break
				
				
                case '3d':
                    if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
                    const tdtype = ["https://textpro.me/3d-gradient-text-effect-online-free-1002.html", "https://textpro.me/3d-box-text-effect-online-880.html"];
                    const tdchoice = tdtype[Math.floor(Math.random() * tdtype.length)];
                    if (arks.length >= 16) return await komi.reply(from, 'No max 10 letras amigo.', id)
                    await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                    const browsertd = await puppeteer.launch(options)
                    const pagetd = await browsertd.newPage()
                    await pagetd.goto(tdchoice, { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                        await pagetd.waitForSelector('#text-0')
                        await pagetd.type("#text-0", body.slice(4))
                        await pagetd.click("#submit")
                        await sleep(10000) // Aumente se sua conexão for superr lenta
                        await pagetd.waitForSelector('div[class="thumbnail"] > img')
                        const divElement = await pagetd.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                        await komi.sendFileFromUrl(from, divElement, '3d.jpg', '', id)
                        await browsertd.close()
                    })
                    break
                    
                case 'slogan':
                    if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
                    if (arks.length >= 16) return await komi.reply(from, 'No max 10 letras amigo.', id)
                    await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                    const browsersg = await puppeteer.launch(options)
                    const pagesg = await browsersg.newPage()
                    await pagesg.goto('https://textpro.me/1917-style-text-effect-online-980.html', { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                        await pagesg.waitForSelector('#text-0')
                        await pagesg.type("#text-0", body.slice(8))
                        await pagesg.click("#submit")
                        await sleep(10000) // Aumente se sua conexão for superr lenta
                        await pagesg.waitForSelector('div[class="thumbnail"] > img')
                        const divElement = await pagesg.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                        await komi.sendFileFromUrl(from, divElement, 'slogan.jpg', '', id)
                        await browsersg.close()
                    })
                    break
                    
                case 'gaming':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo.', id)
                    await komi.reply(from, mess.wait(), id)
                    await komi.sendFileFromUrl(from, `https://docs-jojo.herokuapp.com/api/gaming?text=${body.slice(8)}`, '', '', id)
                    break
                    
                case 'thunder':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
                    if (arks.length >= 16) return await komi.reply(from, 'No max 10 letras amigo.', id)
                    await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                    const browserth = await puppeteer.launch(options)
                    const pageth = await browserth.newPage()
                    await pageth.goto("https://textpro.me/thunder-text-effect-online-881.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                        await pageth.waitForSelector('#text-0')
                        await pageth.type("#text-0", body.slice(9))
                        await pageth.click("#submit")
                        await sleep(10000) // Aumente se sua conexão for superr lenta
                        await pageth.waitForSelector('div[class="thumbnail"] > img')
                        const divElement = await pageth.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                        await komi.sendFileFromUrl(from, divElement, 'thunder.jpg', '', id)
                        await browserth.close()
                    })
                    break
                    
                case 'light':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
                    if (arks.length >= 16) return await komi.reply(from, 'No max 10 letras amigo.', id)
                    await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                    const browserlg = await puppeteer.launch(options)
                    const pagelg = await browserlg.newPage()
                    await pagelg.goto("https://textpro.me/create-a-futuristic-technology-neon-light-text-effect-1006.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                        await pagelg.waitForSelector('#text-0')
                        await pagelg.type("#text-0", body.slice(7))
                        await pagelg.click("#submit")
                        await sleep(10000) // Aumente se sua conexão for superr lenta
                        await pagelg.waitForSelector('div[class="thumbnail"] > img')
                        const divElement = await pagelg.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                        await komi.sendFileFromUrl(from, divElement, 'light.jpg', '', id)
                        await browserlg.close()
                    })
                    break
                    
                case 'wolf':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (args.length >= 2 && arks.includes('|')) {
                        const wolftype = ["https://textpro.me/create-wolf-logo-black-white-937.html", "https://textpro.me/create-wolf-logo-galaxy-online-936.html"];
                        const wolfchoice = wolftype[Math.floor(Math.random() * wolftype.length)];
                        if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10) return await komi.reply(from, 'No max 10 letras amigo p/frase - phrase.', id)
                        await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                        const browserwf = await puppeteer.launch(options)
                        const pagewf = await browserwf.newPage()
                        await pagewf.goto(wolfchoice, { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                            await pagewf.waitForSelector('#text-0')
                            await pagewf.type("#text-0", arg.split('|')[0])
                            await pagewf.type("#text-1", arg.split('|')[1])
                            await pagewf.click("#submit")
                            await sleep(10000) // Aumente se sua conexão for superr lenta
                            await pagewf.waitForSelector('div[class="thumbnail"] > img')
                            const divElement = await pagewf.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                            await komi.sendFileFromUrl(from, divElement, 'wolf.jpg', '', id)
                            await browserwf.close()
                        })
                    } else return await komi.reply(from, mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
                    break
                    
                case 'neon':
                    if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
                    if (arks.length >= 16) return await komi.reply(from, 'No max 10 letras amigo.', id)
                    await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                    const browsernn = await puppeteer.launch(options)
                    const pagenn = await browsernn.newPage()
                    await pagenn.goto("https://textpro.me/create-blackpink-logo-style-online-1001.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                        await pagenn.waitForSelector('#text-0')
                        await pagenn.type("#text-0", body.slice(6))
                        await pagenn.click("#submit")
                        await sleep(10000) // Aumente se sua conexão for superr lenta
                        await pagenn.waitForSelector('div[class="thumbnail"] > img')
                        const divElement = await pagenn.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                        await komi.sendFileFromUrl(from, divElement, 'neon.jpg', '', id)
                        await browsernn.close()
                    })
                    break
                    
                case 'retro':
                    if (args.length >= 4 && arks.includes('|')) {
                        if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10 || arg.split('|')[2].length >= 10) return await komi.reply(from, 'No max 10 letras amigo.', id)
                        await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                        const browserrt = await puppeteer.launch(options)
                        const pagert = await browserrt.newPage()
                        await pagert.goto("https://textpro.me/80-s-retro-neon-text-effect-online-979.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                            await pagert.waitForSelector('#text-0')
                            await pagert.type("#text-0", arg.split('|')[0])
                            await pagert.type("#text-1", arg.split('|')[1])
                            await pagert.type("#text-2", arg.split('|')[2])
                            await pagert.click("#submit")
                            await sleep(10000) // Aumente se sua conexão for superr lenta
                            await pagert.waitForSelector('div[class="thumbnail"] > img')
                            const divElement = await pagert.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                            await komi.sendFileFromUrl(from, divElement, 'retro.jpg', '', id)
                            await browserrt.close()
                        })
                    } else return await komi.reply(from,mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 2 "|".', id)
                    break
                    
                case 'porn':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const porn = await axios.get('https://meme-api.herokuapp.com/gimme/porn')
                    await komi.sendFileFromUrl(from, `${porn.data.url}`, '', `${porn.data.title}`, id)
                    break
                    
                case 'lesbian':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const lesb = await axios.get('https://meme-api.herokuapp.com/gimme/lesbians')
                    await komi.sendFileFromUrl(from, `${lesb.data.url}`, '', `${lesb.data.title}`, id)
                    break
                    
                    
                case 'pgay':
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const gay = await axios.get('https://meme-api.herokuapp.com/gimme/gayporn')
                    await komi.sendFileFromUrl(from, `${gay.data.url}`, '', `${gay.data.title}`, id)
                    break
                    
                case 'logo':
                    if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
                    if (arks.length >= 16) return await komi.reply(from, 'No max 10 letras amigo.', id)
                    await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                    const browser = await puppeteer.launch(options)
                    const page = await browser.newPage()
                    await page.goto("https://textpro.me/create-blackpink-logo-style-online-1001.html", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                        await page.waitForSelector('#text-0')
                        await page.type("#text-0", body.slice(6))
                        await page.click("#submit")
                        await sleep(10000) // Aumente se sua conexão for superr lenta
                        await page.waitForSelector('div[class="thumbnail"] > img')
                        const divElement = await page.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                        await komi.sendFileFromUrl(from, divElement, 'blackpint.jpg', '', id)
                        await browser.close()
                    })
                    break
            /*		
                case 'pornhub':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (args.length >= 2 && arks.includes('|')) {
                        if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10) return await komi.reply(from, 'No max 10 letras amigo p/frase - phrase.', id)
                        await komi.reply(from, mess.wait() + '\n\n20+ s.', id)
                        const browserph = await puppeteer.launch(options)
                        const pageph = await browserph.newPage()
                        await pageph.goto("https://docs-jojo.herokuapp.com/api/phblogo?text1=JOJO&text2=APIs", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
                            await pageph.waitForSelector('#text-0')
                            await pageph.type("#text-0", arg.split('|')[0])
                            await pageph.type("#text-1", arg.split('|')[1])
                            await pageph.click("#submit")
                            await sleep(10000) // Aumente se sua conexão for superr lenta
                            await pageph.waitForSelector('div[class="thumbnail"] > img')
                            const divElement = await pageph.$eval('div[class="thumbnail"] > img', txLogo => txLogo.src)
                            await komi.sendFileFromUrl(from, divElement, 'pornhub.jpg', '', id)
                            await browserph.close()
                        })
                    } else return await komi.reply(from, mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
                    break
                    */
                case 'meme':
                    if (isImage && args.length >= 2 && arks.includes('|') || isQuotedImage && args.length >= 2 && arks.includes('|')) {
                        const memeData = isQuotedImage ? quotedMsg : message
                        const memeupm = await decryptMedia(memeData, uaOverride)
                        const memeUpl = await upload(memeupm, false)
                        await komi.sendFileFromUrl(from, `https://api.memegen.link/images/custom/${encodeURIComponent(arg.split('|')[0])}/${encodeURIComponent(arg.split('|')[1])}.png?background=${memeUpl}`, 'image.png', '', id).catch(async () => { await komi.reply(from, mess.upfail(), id) })
                    } else return await komi.reply(from, mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
                    break
                    
                case 'unban':;case 'unkick':
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
                        if (!quotedMsg) return await komi.reply(from, mess.nomark, id)
                        const unbanq = quotedMsgObj.sender.id
                        if (groupMembersId.includes(unbanq)) return await komi.reply(from, mess.janogp(), id)
                        await komi.sendTextWithMentions(from, mess.unban(unbanq))
                        await komi.addParticipant(groupId, unbanq).catch(async () => { await komi.reply(from, mess.addpessoa(), id) })
                    } else if (isGroupMsg) {
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'kick':;case 'k':
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
                        if (quotedMsg) {
                            const negquo = quotedMsgObj.sender.id
                            if (ownerNumber.includes(negquo)) return await komi.reply(from, mess.vip(), id)
                            if (groupAdmins.includes(negquo)) return await komi.reply(from, mess.removeradm(), id)
                            if (!groupMembersId.includes(negquo)) return await komi.reply(from, mess.notongp(), id)
                            await komi.sendTextWithMentions(from, mess.ban(negquo))
                            await komi.removeParticipant(groupId, negquo)
                        } else {
                            if (mentionedJidList.length == 0) return await komi.reply(from, mess.semmarcar(), id)
                            await komi.sendTextWithMentions(from, mess.kick(mentionedJidList))
                            for (let i = 0; i < mentionedJidList.length; i++) {
                                if (ownerNumber.includes(mentionedJidList[i])) return await komi.reply(from, mess.vip(), id)
                                if (groupAdmins.includes(mentionedJidList[i])) return await komi.reply(from, mess.removeradm(), id)
                                await komi.removeParticipant(groupId, mentionedJidList[i])
                            }
                        }
                    } else if (isGroupMsg) {
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'sair':
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        await komi.sendText(from, mess.goodbye()).then(async () => { await komi.leaveGroup(groupId) })
                    } else if (isGroupMsg) {
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'promote':; case 'pm':
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
                        if (quotedMsg) {
                            const proquo = quotedMsgObj.sender.id
                            if (groupAdmins.includes(proquo)) return await komi.reply(from, mess.isadm(), id)
                            await komi.sendTextWithMentions(from, mess.promote(proquo))
                            await komi.promoteParticipant(groupId, proquo)
                        } else {
                            if (mentionedJidList.length == 0) return await komi.reply(from, mess.semmarcar(), id)
                            await komi.sendTextWithMentions(from, mess.promote(mentionedJidList))
                            var isPromo = ''
                            for (let i = 0; i < mentionedJidList.length; i++) {
                                if (groupAdmins.includes(mentionedJidList[i])) isPromo += `@${mentionedJidList[i].replace('@c.us', '')} `
                                await komi.promoteParticipant(groupId, mentionedJidList[i])
                            }
                            if (isPromo !== '') {
                                isPromo += `\n\n${mess.isadm()}`
                                await komi.sendTextWithMentions(from, isPromo, id)
                            }
                        }
                    } else if (isGroupMsg) {
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'demote':; case 'dm':
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
                        if (quotedMsg) {
                            const demquo = quotedMsgObj.sender.id
                            if (!groupAdmins.includes(demquo)) return await komi.reply(from, mess.notadm, id)
                            await komi.sendTextWithMentions(from, mess.demote(demquo))
                            await komi.demoteParticipant(groupId, demquo)
                        } else {
                            if (mentionedJidList.length == 0) return await komi.reply(from, mess.semmarcar(), id)
                            await komi.sendTextWithMentions(from, mess.demote(mentionedJidList))
                            var isNaM = ''
                            for (let i = 0; i < mentionedJidList.length; i++) {
                                if (!groupAdmins.includes(mentionedJidList[i])) isNaM += `@${mentionedJidList[i].replace('@c.us', '')} `
                                await komi.demoteParticipant(groupId, mentionedJidList[i])
                            }
                            if (isNaM !== '') {
                                isNaM += `\n\n${mess.notadm()}`
                                await komi.sendTextWithMentions(from, isNaM, id)
                            }
                        }
                    } else if (isGroupMsg) {
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'ping':
                    const rTime = (seconds) => {
                        const pad = (s) => { return (s < 10 ? '0' : '') + s }
                        var hours = Math.floor(seconds / (60*60)); var minutes = Math.floor(seconds % (60*60) / 60); var seconds = Math.floor(seconds % 60)
                        return `${pad(hours)} horas | ${pad(minutes)} minutos | ${pad(seconds)} segundos - HH:MM:SS`
                    }
                    const osUptime = () => {
                        var up_sec = os.uptime(); var up_min = up_sec / 60; var up_hour = up_min / 60; up_sec = Math.floor(up_sec); up_min = Math.floor(up_min); up_hour = Math.floor(up_hour); up_hour = up_hour % 60; up_min = up_min % 60; up_sec = up_sec % 60
                        return `${up_hour} horas | ${up_min} minutos | ${up_sec} segundos - HH:MM:SS`
                    }
                    const ramMemory = () => {
                        var allRam = os.totalmem(); var kbRam = allRam/1024; var mbRam = kbRam/1024; var gbRam = mbRam/1024; kbRam = Math.floor(kbRam); mbRam = Math.floor(mbRam); gbRam = Math.floor(gbRam); mbRam = mbRam%1024; kbRam = kbRam%1024; allRam = allRam%1024;
                        return `${gbRam}GB | ${mbRam}MB | ${kbRam}KB | ${allRam} Bytes`
                    }
                    const timeBot = rTime(process.uptime())
                    const loadedMsg = await komi.getAmountOfLoadedMessages()
                    const chatIds = await komi.getAllChatIds()
                    const groups = await komi.getAllGroups()
                    const zapVer = await komi.getWAVersion()
                    const botBat = await komi.getBatteryLevel()
                    const isEnergy = await komi.getIsPlugged()
                    await komi.reply(from, mess.stats(timeBot, osUptime, ramMemory, os, loadedMsg, groups, chatIds, processTime, t, moment, zapVer, botBat, isEnergy), id)
                    break
                    
                case 'join':
                    if (args.length == 0) return await komi.reply(from, mess.nolink(), id)
                    const gplk = body.slice(6)
                    const tGr = await komi.getAllGroups()
                    const isLink = gplk.match(/(https:\/\/chat.whatsapp.com)/gi)
                    const check = await komi.inviteInfo(gplk)
                    const memberlmt = check.size
                    if (!isLink) return await komi.reply(from, mess.nolink(), id)
                    if (tGr.length > config.Max_Groups) return await komi.reply(from, mess.cheio(tGr), id)
                    if (memberlmt < config.Min_Membros) return await komi.reply(from, mess.noreq(memberlmt), id)
                    if (check.status == 200) {
                        await komi.joinGroupViaLink(gplk).then(async () => { await komi.reply(from, mess.maked()) })
                    } else return await komi.reply(from, mess.fail(), id)
                    break
                    
                case 'delete':;case 'del':; case 'd':
                //	if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        if (!quotedMsg) return await komi.reply(from, mess.mymess(), id)
                        if (!quotedMsgObj.fromMe) return await komi.reply(from, mess.mymess(), id)
                        await komi.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
                    } else if (isGroupMsg) {
                        if (!quotedMsgObj.fromMe) return await komi.reply(from, mess.mymess(), id)
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'tela': case 'print':
                    if (!isOwner) return await komi.reply(from, mess.sodono(), id)
                    const sesPic = await komi.getSnapshot()
                    await komi.sendFile(from, sesPic, 'session.png', 'Neh...', id)
                    break
                    
                case 'placa':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (!region == 'pt') return await komi.reply(from, 'Somente placa do brasil', id)
                    if (args.length == 0) return await komi.reply(from, 'Coloque uma placa para puxar.', id)
                    if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
                    await sinesp.search(`${args[0]}`).then(async (dados) => {
                        await komi.reply(from, `Placa: ${dados.placa}\n\nSituação: ${dados.situacao}\n\nModelo: ${dados.modelo}\n\nMarca: ${dados.marca}\n\nCor: ${dados.cor}\n\nAno: ${dados.ano}\n\nAno do modelo: ${dados.anoModelo}\n\nEstado: ${dados.uf}\n\nMunicipio: ${dados.municipio}\n\nChassi: ${dados.chassi}.`, id)
                    }).catch(async (error) => {
                        await komi.reply(from, 'Nenhuma placa encontrada.', id)
                        console.log(color('[SINESP]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
                    })
                    break
                    
                case 'phcom':
                    try {
                        if (args.length == 0 || !arks.includes('|')) return await komi.reply(from, mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
                        await komi.reply(from, mess.wait(), id)
                        if (isImage || isQuotedImage) {
                            const phcoM = isQuotedImage ? quotedMsg : message
                            const getphComP = await decryptMedia(phcoM, uaOverride)
                            var thephComP = await upload(getphComP, false)
                        } else { var thephComP = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
                        if (thephComP == null || typeof thephComP === 'object') thephComP = errorImg
                        const mentionRmv = mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' ')
                        const dataSendPh = { username: arg.split('|')[0].replace(mentionRmv, ''), message: arg.split('|')[1], image: thephComP }
                        await canvacord.Canvas.phub(dataSendPh).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `pornhub.png`, '', id) })
                    } catch (error) {
                        await komi.reply(from, mess.fail(), id)
                        console.log(color('[PHCOM]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
                    }
                    break
                    
                case 'ytcom':
                    try {
                        if (args.length == 0 || !arks.includes('|')) return await komi.reply(from, mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
                        await komi.reply(from, mess.wait(), id)
                        if (isImage || isQuotedImage) {
                            const ytcoM = isQuotedImage ? quotedMsg : message
                            const getYtComP = await decryptMedia(ytcoM, uaOverride)
                            var theYtComP = await upload(getYtComP, false)
                        } else { var theYtComP = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
                        if (theYtComP == null || typeof theYtComP === 'object') theYtComP = errorImg
                        const mentionRemove = mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' ')
                        const dataSendYt = { username: arg.split('|')[0].replace(mentionRemove, ''), content: arg.split('|')[1], avatar: theYtComP, dark: false }
                        await canvacord.Canvas.youtube(dataSendYt).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `youtube.png`, '', id) })
                    } catch (error) {
                        await komi.reply(from, mess.fail(), id)
                        console.log(color('[YTCOM]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
                    }
                    break
                    
                case 'enviar':
                    if (args.length == 0 || !arks.includes('|')) return await komi.reply(from, mess.noargs() + 'Digite algo' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
                    const gid = isGroupMsg ? groupId.replace('@g.us', '') : user.replace('@c.us', '')
                    const nofsender = isGroupMsg ? name : pushname
                    const gporpv = isGroupMsg ? '-gp' : '-pv'
                    try {
                        const sendAFile = async (quotedMsgObj, args, type, nofsender) => {
                            let replyOnReply = await komi.getMessageById(quotedMsgObj.id)
                            let obj = replyOnReply.quotedMsgObj
                            if (/ptt|audio|video|image|document|sticker/.test(quotedMsgObj.type)) {
                                if (quotedMsgObj.animated) quotedMsgObj.mimetype = ''
                            } else if (obj && /ptt|audio|video|image/.test(obj.type)) { quotedMsgObj = obj } else return
                            const mediaData = await decryptMedia(quotedMsgObj)
                            await komi.sendFile(`${args[1]}` + type, `data:${quotedMsgObj.mimetype};base64,${mediaData.toString('base64')}`, '', `De/From ${nofsender}`)
                        }
                        if (args[0].toLowerCase() == '-gp') {
                            await komi.sendText(`${args[1]}` + '@g.us', `_Mensagem >_\n"${arg.split('|')[1]} "` + '\n\n_Quem enviou =_ ' + '\n*"' + nofsender + '"*' + '\n\n_Como responder:_')
                            await komi.sendText(`${args[1]}` + '@g.us', `${prefix}enviar ${gporpv} ${gid} | Coloque sua resposta aqui`)
                            await komi.reply(from, mess.maked(), id)
                            if (quotedMsgObj) { await sendAFile(quotedMsgObj, args, '@g.us', nofsender) }
                        } else if (args[0].toLowerCase() == '-pv') {
                            await komi.sendText(`${args[1]}` + '@c.us', `_Mensagem >_\n"${arg.split('|')[1]}"` + '\n\n_Quem enviou =_ ' + '*' + nofsender + '*' + '\n\n_Como responder:_')
                            await komi.sendText(`${args[1]}` + '@c.us', `${prefix}enviar ${gporpv} ${gid} | Coloque sua resposta aqui`)
                            await komi.reply(from, mess.maked(), id)
                            if (quotedMsgObj) { await sendAFile(quotedMsgObj, args, '@c.us', nofsender) }
                        } else return await komi.reply(from, mess.enviar(), id)
                    } catch (error) {
                        await komi.reply(from, mess.noctt(), id)
                        console.log(color('[ENVIAR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
                    }
                    break
                    
                case 'blocklist':
                    if (!isOwner) return await komi.reply(from, mess.sodono(), id)
                    let hih = `🔐 - Block: ${blockNumber.length}\n\n`
                    for (let i of blockNumber) { hih += `➸ @${i.replace(/@c.us/g,'')}\n` }
                    await komi.sendTextWithMentions(from, hih)
                    break
                    
                case 'shutdown':;case 'encerrar':
                    if (!isOwner) return await komi.reply(from, mess.sodono(), id)
                    var timeToShut = 10; var theTimeVis = '10'
                    if (!isNaN(args[0])) { timeToShut = Number(args[0]) * 1000;theTimeVis = args[0] }
                    await komi.reply(from, mess.shutdown(theTimeVis), id)
                    await sleep(timeToShut)
                    await komi.komi()
                    break
                    
                case 'loli':
                    const onefive = Math.floor(Math.random() * 145) + 1
                    await komi.sendFileFromUrl(from, `https://media.publit.io/file/Twintails/${onefive}.jpg`, 'loli.jpg', mess.logomgs(), id)
                    break
                    
                case 'hug':
                    const ahug = ["https://api.computerfreaker.cf/v1/hug", "hug"];const bhug = ahug[Math.floor(Math.random() * ahug.length)]
                    const chug = bhug.includes('https') ? await axios.get(bhug) : await axios.get('https://nekos.life/api/v2/img/' + bhug)
                    await komi.sendStickerfromUrl(from, chug.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'antiporn':
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
                        if (args[0].toLowerCase() == 'on') {
                            if (functions[0].antiporn.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
                            functions[0].antiporn.push(groupId)
                            await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
                            await komi.reply(from, mess.enabled(), id)
                        } else if (args[0].toLowerCase() == 'off') {
                            if (!functions[0].antiporn.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
                            functions[0].antiporn.splice(groupId, 1)
                            await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
                            await komi.reply(from, mess.disabled(), id)
                        } else return await komi.reply(from, mess.kldica1(), id)
                    } else if (isGroupMsg) {
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'antilinks':
                    if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
                        if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
                        if (args[0].toLowerCase() == 'on') {
                            if (functions[0].antilinks.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
                            functions[0].antilinks.push(groupId)
                            await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
                            await komi.reply(from, mess.enabled(), id)
                        } else if (args[0].toLowerCase() == 'off') {
                            if (!functions[0].antilinks.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
                            functions[0].antilinks.splice(groupId, 1)
                            await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
                            await komi.reply(from, mess.disabled(), id)
                        } else return await komi.reply(from, mess.kldica1(), id)
                    } else if (isGroupMsg) {
                        await komi.reply(from, mess.soademiro(), id)
                    } else return await komi.reply(from, mess.sogrupo(), id)
                    break
                    
                case 'baguette':
                    const baguette = await axios.get('https://api.computerfreaker.cf/v1/baguette')
                    await komi.sendFileFromUrl(from, `${baguette.data.url}`, `baguette.jpg`, '🥖', id)
                    break
                    
                case 'dva':
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const dva = await axios.get('https://api.computerfreaker.cf/v1/dva')
                    await komi.sendFileFromUrl(from, `${dva.data.url}`, `dva.jpg`, `😍`, id)
                    break
                    
                case 'waifu':
                    if (side == 1) {
                        const waifu = await fs.readFileSync('./lib/config/Utilidades/waifu.json')
                        const waifuParse = JSON.parse(waifu)
                        const waifuChoice = Math.floor(Math.random() * waifuParse.length)
                        const getWaifu = waifuParse[waifuChoice]
                        await komi.sendFileFromUrl(from, getWaifu.image, 'waifu.jpg', getWaifu.desc, id)
                    } else if (side == 2) {
                        const waifu3 = await axios.get(`https://waifu.pics/api/sfw/waifu`)
                        await komi.sendFileFromUrl(from, waifu3.data.url, '', 'hmmm...', id)
                    }
                    break
                    
                case 'husb':
                    const husb = await fs.readFileSync('./lib/config/Utilidades/husb.json')
                    const husbParse = JSON.parse(husb)
                    const husbChoice = Math.floor(Math.random() * husbParse.length)
                    const getHusb = husbParse[husbChoice]
                    await komi.sendFileFromUrl(from, getHusb.image, 'husb.jpg', getHusb.desc, id)
                    break
                    
                case 'iecchi':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const recchi = ["ero", "erokemo", "erok"];
                    const recchic = recchi[Math.floor(Math.random() * recchi.length)];
                    const ecchi = await axios.get('https://nekos.life/api/v2/img/' + recchic)
                    await komi.sendFileFromUrl(from, ecchi.data.url, id)
                    break
                    
                case 'tits':
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rtits = ["tits", "BestTits", "boobs", "BiggerThanYouThought", "smallboobs", "TinyTits", "SmallTitsHugeLoad", "amazingtits"];
                    const rtitsc = rtits[Math.floor(Math.random() * rtits.length)];
                    const tits = await axios.get('https://meme-api.herokuapp.com/gimme/' + rtitsc)
                    await komi.sendFileFromUrl(from, `${tits.data.url}`, '', `${tits.data.title}`, id)
                    break
                    
                case 'milf':
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rmilf = ["Bbwmilf", "milf"];
                    const rmilfc = rmilf[Math.floor(Math.random() * rmilf.length)];
                    const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rmilfc);
                    await komi.sendFileFromUrl(from, `${milf1.data.url}`, '', `${milf1.data.title}`, id)
                    break
                    
                case 'bdsm':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rbdsm = ["BDSMPics", "bdsm", "TeenBDSM"];
                    const rbdsmc = rbdsm[Math.floor(Math.random() * rbdsm.length)];
                    const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rbdsmc);
                    await komi.sendFileFromUrl(from, `${bdsm1.data.url}`, '', `${bdsm1.data.title}`, id)
                    break
                    
                case 'ass':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rass = ["CuteLittleButts", "ass", "bigasses"];const rassc = rass[Math.floor(Math.random() * rass.length)]
                    const bowass = await axios.get('https://meme-api.herokuapp.com/gimme/' + rassc);
                    await komi.sendFileFromUrl(from, `${bowass.data.url}`, '', `${bowass.data.title}`, id)
                    break		
                    
                case 'pussy':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rpussy = ["pussy", "ass", "LegalTeens"];const rpussyc = rpussy[Math.floor(Math.random() * rpussy.length)]
                    const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rpussyc)
                    await komi.sendFileFromUrl(from, `${bows1.data.url}`, '', `${bows1.data.title}`, id)
                    break
                    
                case 'blowjob':;case 'boquete':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rblowj = ["bj", "blowjob"];const rblowjc = rblowj[Math.floor(Math.random() * rblowj.length)]
                    const blowjob = await axios.get('https://nekos.life/api/v2/img/' + rblowjc)
                    await komi.sendStickerfromUrl(from, blowjob.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'feet':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rfeet = ["feetg", "erofeet"];const rfeetc = rfeet[Math.floor(Math.random() * rfeet.length)]
                    const feet = await axios.get('https://nekos.life/api/v2/img/' + rfeetc)
                    await komi.sendStickerfromUrl(from, feet.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'hard':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const hard = await axios.get('https://nekos.life/api/v2/img/spank')
                    await komi.sendStickerfromUrl(from, hard.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'boobs':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rboobs = ["boobs", "tits"];const rboobsc = rboobs[Math.floor(Math.random() * rboobs.length)]
                    const bobis = await axios.get('https://nekos.life/api/v2/img/' + rboobsc)
                    await komi.sendStickerfromUrl(from, bobis.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'lick':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rlick = ["kuni", "les"];const rlickc = rlick[Math.floor(Math.random() * rlick.length)]
                    const lick = await axios.get('https://nekos.life/api/v2/img/' + rlickc)
                    await komi.sendStickerfromUrl(from, lick.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'femdom':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rfemdon = ["femdom", "yuri", "eroyuri"];const rfemdonc = rfemdon[Math.floor(Math.random() * rfemdon.length)]
                    const femdom = await axios.get('https://nekos.life/api/v2/img/' + rfemdonc)
                    await komi.sendFileFromUrl(from, femdom.data.url, '', '', id)
                    break
                    
                case 'futanari':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const futanari = await axios.get('https://nekos.life/api/v2/img/futanari')
                    await komi.sendFileFromUrl(from, futanari.data.url, '', '', id)
                    break
                    
                case 'masturb':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rmastub = ["solo", "solog"];const rmastubc = rmastub[Math.floor(Math.random() * rmastub.length)]
                    const mstbra = await axios.get('https://nekos.life/api/v2/img/' + rmastubc)
                    await komi.sendStickerfromUrl(from, mstbra.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'anal':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const ranal = ["cum", "cum_jpg"];const ranalc = ranal[Math.floor(Math.random() * ranal.length)]
                    const solog = await axios.get('https://nekos.life/api/v2/img/' + ranalc)
                    await komi.sendStickerfromUrl(from, solog.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break		 
                    
                case 'randomloli':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const loliz = await axios.get('https://nekos.life/api/v2/img/keta')
                    await komi.sendImageAsSticker(from, loliz.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'nsfwicon':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const icon = await axios.get('https://nekos.life/api/v2/img/nsfw_avatar')
                    await komi.sendImageAsSticker(from, icon.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'truth':
                    const memean = await axios.get('https://nekos.life/api/v2/img/gecg')
                    await komi.sendFileFromUrl(from, memean.data.url, '', '', id)
                    break
                    
                case 'icon':
                    const avatarz = await axios.get('https://nekos.life/api/v2/img/avatar')
                    await komi.sendImageAsSticker(from, avatarz.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'face':
                    const gasm = await axios.get('https://nekos.life/api/v2/img/gasm')
                    await komi.sendImageAsSticker(from, gasm.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'pezinho':
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const pezin = await axios.get('https://nekos.life/api/v2/img/feet')
                    await komi.sendFileFromUrl(from, pezin.data.url, '', '', id)
                    break
                    
                case 'corno':
                    const howCorno = getChifre[Math.floor(Math.random() * getChifre.length)]
                if (mentionedJidList.length !== 0) {
                        await komi.sendTextWithMentions(from, `${arqs[1]} é ${lvpc}%...\n\n"${howGado}"\n\nE nas horas vagas ${lvrq}%...\n\n"${howCorno}" 😳.`)
                    } else { await komi.reply(from, `Você é ${lvpc}%...\n\n"${howGado}"\n\nE nas horas vagas ${lvrq}%...\n\n"${howCorno}" 😳.`, id) }
                    break
                    
                case 'gamemode':
                    if (args.length == 0) return await komi.reply(from, mess.cors(), id)
                    if (args[0].toLowerCase() == '0' || args[0].toLowerCase() == 's' || args[0].toLowerCase() == 'survival') {
                        await komi.sendTextWithMentions(from, mess.mine(user) + 'survival.')
                    } else if (args[0].toLowerCase() == '1' || args[0].toLowerCase() == 'c' || args[0].toLowerCase() == 'creative') {
                        await komi.sendTextWithMentions(from, mess.mine(user) + 'creative.')
                    } else if (args[0].toLowerCase() == '2' || args[0].toLowerCase() == 'a' || args[0].toLowerCase() == 'adventure') {
                        await komi.sendTextWithMentions(from, mess.mine(user) + 'adventure.')
                    } else if (args[0].toLowerCase() == '3' || args[0].toLowerCase() == 'spectator') {
                        await komi.sendTextWithMentions(from, mess.mine(user) + 'espectador.')
                    } else return await komi.reply(from, mess.cors(), id)
                    break
                    
                case 'ihentai':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const hntai = ["hentai", "pussy", "pussy_jpg", "classic", "https://api.computerfreaker.cf/v1/hentai"];const hentcc = hntai[Math.floor(Math.random() * hntai.length)]
                    const hentai1 = hentcc.includes('https') ? await axios.get(hentcc) : await axios.get('https://nekos.life/api/v2/img/' + hentcc)
                    await komi.sendStickerfromUrl(from, hentai1.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'yuri':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    const yuri = await axios.get('https://api.computerfreaker.cf/v1/yuri')
                    await komi.sendFileFromUrl(from, `${yuri.data.url}`, ``, ``, id)
                    break 
                    
                case 'randomneko':
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rnekoi = ["nsfw_neko_gif", "hololewd", "lewdk", "lewdkemo", "eron", "holoero", "https://api.computerfreaker.cf/v1/nsfwneko"];const rnekoc = rnekoi[Math.floor(Math.random() * rnekoi.length)]
                    const nekons = rnekoc.includes('https') ? await axios.get(rnekoc) : await axios.get('https://nekos.life/api/v2/img/' + rnekoc)
                    await komi.sendStickerfromUrl(from, nekons.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'trap':
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    if (isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
                    const rtrap = ["trap", "https://api.computerfreaker.cf/v1/trap"];const rtrapc = rtrap[Math.floor(Math.random() * rtrap.length)]
                    const tapr = rtrapc.includes('https') ? await axios.get(rtrapc) : await axios.get('https://nekos.life/api/v2/img/' + rtrapc)
                    await komi.sendFileFromUrl(from, tapr.data.url, '', '', id)
                    break
                    
                case 'randomwall' :
                    if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
                    const walnime = await axios.get('https://nekos.life/api/v2/img/wallpaper')
                    await komi.sendFileFromUrl(from, walnime.data.url, '', '', id)
                    break
                    
                case 'valor':
                    if (args.length !== 2) return await komi.reply(from, mess.moneyerr(), id)
                    const money = await axios.get(`https://${encodeURIComponent(args[0])}.rate.sx/${encodeURIComponent(args[1])}`)
                    const chkmy = money.data
                    if (isNaN(chkmy)) return await komi.reply(from, mess.moneyerr(), id)
                    await komi.reply(from, `*${args[1]}* → *${money.data.toFixed(2)}* ${args[0]}`, id)
                    break
                    
                case 'dog':
                    if (side == 1) {
                        const list = await axios.get('http://shibe.online/api/shibes')
                        await komi.sendFileFromUrl(from, list.data[0], '', '🐕', id)
                    } else if (side == 2) {
                        const doug = await axios.get('https://nekos.life/api/v2/img/woof')
                        await komi.sendFileFromUrl(from, doug.data.url, '', '🐕', id)
                    }
                    break
                    
                case 'look' :
                    const smug = await axios.get('https://nekos.life/api/v2/img/smug')
                    await komi.sendStickerfromUrl(from, smug.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'holo' :
                    const holo = await axios.get('https://nekos.life/api/v2/img/holo')
                    await komi.sendFileFromUrl(from, holo.data.url, '', '', id)
                    break
                    
                case 'kisu':
                    const kisu = await axios.get('https://nekos.life/api/v2/img/kiss')
                    await komi.sendStickerfromUrl(from, kisu.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'tapa':
                    const tapi = await axios.get('https://nekos.life/api/v2/img/slap')
                    await komi.sendStickerfromUrl(from, tapi.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
                    break
                    
                case 'gato':;case 'cat':
                    if (args.length !== 2 || isNaN(args[0]) || isNaN(args[1])) {
                        const catu = await axios.get('https://nekos.life/api/v2/img/meow')
                        await komi.sendFileFromUrl(from, catu.data.url, 'gato.jpg', mess.cats(), id)
                    } else { await komi.sendFileFromUrl(from, `https://placekitten.com/${args[0]}/${args[1]}`, 'neko.png', 'Nekooo', id) }
                    break
                    
                case 'pokemon':
                    if (args.length == 0) return await komi.reply(from, mess.nopoke(), id)
                    const pokemae = await Pokemon.getPokemon(args[0])
                    if (pokemae == null) return await komi.reply(from, mess.noresult(), id)
                    let atkspoke = '\n'
                    for (let i = 0; i < pokemae.moves.length; i++) { atkspoke += `➸ ${pokemae.moves[i]}\n` }
                    await komi.sendFileFromUrl(from, pokemae.sprites.front_default, 'pokemon.png', mess.pokemon(pokemae, atkspoke), id)
                    //const pokemon = Math.floor(Math.random() * 898) + 1
                    //await komi.sendFileFromUrl(from, 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/' + pokem + '.png', 'Pokemon.png', '', id)
                    break		
                    
                case 'screenshot':
                    if (args.length == 0 || !isUrl(url)) return await komi.reply(from, mess.nolink(), id)
                    await komi.sendFileFromUrl(from, `https://api.apiflash.com/v1/urltoimage?accesaas_key=${config.API_NoFlash}&url=${url}`, 'ss.jpeg', mess.noporn(), id)
                    break
                    
                case 'ship':
                    if (isGroupMsg && args.length == 2 && mentionedJidList.length !== 0) { 
                        await komi.sendTextWithMentions(from, mess.love(arqs, lvpc))
                    } else if (args.length == 1) {
                        await komi.reply(from, mess.lovepv(arqs, lvpc))
                    } else return await komi.reply(from, mess.nocrush(), id)
                    break	
                    
                
			case 'gay':;case 'lgbt':
				var twgui = lgbt[Math.floor(Math.random() * lgbt.length)]
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const ALgBTt = isQuotedImage ? quotedMsg : message
						const getLgBtPic = await decryptMedia(ALgBTt, uaOverride)
						var theLgBtic = await upload(getLgBtPic, false)
					} else { var theLgBtic = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theLgBtic == null || typeof theLgBtic === 'object') theLgBtic = errorImg
					await canvacord.Canvas.rainbow(theLgBtic).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `gay.png`, mess.lgbt(lvpc, guei, lvrq, twgui), id) })
				} catch (error) {
					console.log(color('[GAY]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					await komi.reply(from, mess.fail(), id)
				}
				break
				
			case 'chance':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
				await komi.reply(from, mess.botmonkey(body, lvpc), id)
				break
				
			case 'kiss':
				const getMeKiss = quotedMsg ? quotedMsgObj.sender.id.replace('@c.us', '') : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
				const kiss = await axios.get('https://nekos.life/api/v2/img/kiss')
				await komi.sendStickerfromUrl(from, kiss.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				await komi.sendTextWithMentions(from, mess.kiss(user, getMeKiss))
				break
				
			case 'slap':
				const getMeSlap = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
				const tapa = await axios.get('https://nekos.life/api/v2/img/slap')
				await komi.sendStickerfromUrl(from, tapa.data.url, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				await komi.sendTextWithMentions(from, mess.tapa(user, getMeSlap))
				break
				
			case 'getmeme':
				if (region == 'pt') var thememer = 'memesbrasil'
				if (region == 'en') var thememer = 'memes'
				if (region == 'es') var thememer = 'SpanishMeme'
				const response = await axios.get('https://meme-api.herokuapp.com/gimme/' + thememer);
				await komi.sendFileFromUrl(from, `${response.data.url}`, 'meme.jpg', `${response.data.title}`, id)
				break
				
			case 'date':;case 'data':
			await komi.reply(from, `${time}`, id)
			break
				
			case 'menu':;case'ajuda':
			const theMsg = await gaming.getValue(user, nivel, 'msg')
			const uzrXp = await gaming.getValue(user, nivel, 'xp')
			const uzrlvl = await gaming.getValue(user, nivel, 'level')
		    const mping = processTime(t, moment())
			await komi.sendFile(from,'./lib/media/foto/menu.jpg', 'menu.jpg',mess.menu(pushname, time, theMsg, uzrXp, getReqXP(uzrlvl), uzrlvl, mping, patente), id)
			break

			case 'linkbot':
			await komi.reply(from, mess.linktre(), id)
			break
			case 'vip':
			komi.sendButtons(from, 'Essas são as suas opções ',[{id: 'dono', text: 'falar com o dono'},{id: 'pix', text: 'comprar vip!'} ], 'COMPRA VIP/PREMIUM', '@komi-bot\nCaso Queira ver a tabela digite /valores')
			break
			case 'valores':
	 		komi.sendButtons(from, 'Aperte nesse botão abaixo para receber a tabela de preços',[{id: 'valores', text: 'Tabela de preços'}], 'COMPRA VIP/PREMIUM', '@komi-bot', id)
	        break

        	case 'menuvip':
		    await komi.reply(from, mess.menuvip(), id)
		    break

			case 'stickers':
			await komi.reply(from, mess.stickers(), id)
			break
				
			case 'otaku':
		    await komi.reply(from, mess.anime(), id)
			break
				
			case 'games':
			await komi.reply(from, mess.games(), id)
			break
				
			case 'admins':;case'menuadm':
			if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
			if (!isGroupAdmins && !isOwner) return await komi.reply(from, mess.soademiro(), id)
			await komi.reply(from, mess.admins(), id)
			break
				
			case 'adult':
            if (!isGroupMsg && !isNsfw) return await komi.reply(from, mess.gpadulto(), id)
			await komi.reply(from, mess.adult(), id)
			break
				
			case 'dono':
			if (!isOwner) return await komi.reply(from, mess.sodono(), id)
			await komi.reply(from, mess.owner(), id)
			break
				
			case 'down':
			await komi.reply(from, mess.down(), id)
			break
				
			case 'dados':
			await komi.reply(from, mess.dados(), id)
			break
				
			case 'midia':
			await komi.reply(from, mess.midia(), id)
			break
				
			case 'outros':
			await komi.reply(from, mess.outros(), id)
			break
				
			case 'maker':
			await komi.reply(from, mess.maker(), id)
			break
				
			case 'cmd':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				await komi.reply(from, mess.cmd(), id)
				const cmdw = await exec(`bash -c '${body.slice(5)}'`, async (error, stdout, stderr) => {
					if (error || stderr || stdout == null || stdout == '') {
						console.log(stderr, error)
						await komi.reply(from, error + '\n\n' + stderr, id)
					} else { console.log(stdout); await komi.reply(from, stdout, id) }
				})
				break
				
			case 'mac':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'mac (ex: 70:B3:D5:03:62:A1).', id)
				await komi.reply(from, mess.wait(), id)
				const maclk = await axios.get(`https://api.macvendors.com/${encodeURIComponent(body.slice(5))}`)
				await komi.reply(from, `📱 → ${maclk.data}.`, id)
				break
				
			case 'converter':;case 'conv':
				if (args == 0) return await komi.reply(from, mess.conv(), id)
				try {
					if (args[0].toLowerCase() == '-f') {
						if (isNaN(args[1])) return await komi.reply(from, mess.onlynumber(), id)
						const cels = args[1] / 5 * 9 + 32
						await komi.reply(from, `*${args[1]}* _C° - Celsius =_ ${cels} _F° - Fahrenheit._`, id)
					} else if (args[0].toLowerCase() == '-c') {
						if (isNaN(args[1])) return await komi.reply(from, mess.onlynumber(), id)
						const fahf = 5 * (args[1] - 32) / 9
						await komi.reply(from, `*${args[1]}* _F° - Fahrenheit =_ *${fahf}* _C° - Celsius._`, id)
					} else if (args[0].toLowerCase() == '-m') {
						if (isNaN(args[1])) return await komi.reply(from, mess.onlynumber(), id)
						const ktom = args[1] * 0.62137
						await komi.reply(from, `*${args[1]}* _KM =_ *${ktom}* _MI._`, id)
					} else if (args[0].toLowerCase() == '-q') {
						if (isNaN(args[1])) return await komi.reply(from, mess.onlynumber(), id)
						const mtok = args[1] / 0.62137
						await komi.reply(from, `*${args[1]}* _MI =_ *${mtok}* _KM._`, id)
					} else return await komi.reply(from, mess.conv(), id)
				} catch (error) { 
					await komi.reply(from, mess.onlynumber(), id)
					console.log(color('[CONVERSOR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'mute':;case 'silence':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].silence.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].silence.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/silence.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].silence.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].silence.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/silence.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else return await komi.reply(from, mess.soademiro(), id)
				break
				
			case 'scnpj':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (!region == 'pt') return await komi.reply(from, '/Brasil somente!', id)
				if (args.length == 1) {
					const cnpj = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${encodeURIComponent(body.slice(7))}`)
					if (cnpj.data.status == 'ERROR') return await komi.reply(from, cnpj.data.message, id)
					await komi.reply(from, `✪ CNPJ: ${cnpj.data.cnpj}\n\n✪ Tipo: ${cnpj.data.tipo}\n\n✪ Nome: ${cnpj.data.nome}\n\n✪ Região: ${cnpj.data.uf}\n\n✪ Telefone: ${cnpj.data.telefone}\n\n✪ Situação: ${cnpj.data.situacao}\n\n✪ Bairro: ${cnpj.data.bairro}\n\n✪ Logradouro: ${cnpj.data.logradouro}\n\n✪ CEP: ${cnpj.data.cep}\n\n✪ Casa N°: ${cnpj.data.numero}\n\n✪ Municipio: ${cnpj.data.municipio}\n\n✪ Abertura: ${cnpj.data.abertura}\n\n✪ Fantasia: ${cnpj.data.fantasia}\n\n✪ Jurisdição: ${cnpj.data.natureza_juridica}`, id)
				} else return await komi.reply(from, 'Especifique um CNPJ sem os traços e pontos.', id)
				break
				
			case 'coins':
				await komi.reply(from, mess.coins(), id)
				break
				
			case 'mutepv':
				if (args.length == 0) return await komi.reply(from, mess.kldica2(), id)
				if (isOwner) {
					if (args[0].toLowerCase() == 'on') {
						const pvmt = body.slice(11) + '@c.us'
						if (functions[0].silence.includes(pvmt)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].silence.push(pvmt)
						await fs.writeFileSync('./lib/config/Gerais/silence.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						const pvmt = body.slice(11) + '@c.us'
						if (!functions[0].silence.includes(pvmt)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].silence.splice(pvmt, 1)
						await fs.writeFileSync('./lib/config/Gerais/silence.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica2(), id)
				} else return await komi.reply(from, mess.sodono())
				break
				
			case 'autosticker':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].sticker.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].sticker.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].sticker.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].sticker.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else if (isGroupMsg) {
					await komi.reply(from, mess.soademiro(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'unblock':
				if (isOwner) {
					if (isGroupMsg && quotedMsg || isGroupMsg && mentionedJidList.length !== 0 ) {
						const unblokea = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : args[0] + '@c.us')
						await komi.contactUnblock(`${unblokea}`).then(async () => { await komi.sendTextWithMentions(from, mess.unblock(unblokea)) })
					} else return await komi.reply(from, mess.semmarcar(), id)
				} else return await komi.reply(from, mess.sodono(), id)
				break
				
			case 'block':
				if (isOwner) {
					if (isGroupMsg && quotedMsg || isGroupMsg && mentionedJidList.length !== 0 ) {
						const blokea = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : args[0] + '@c.us')
						await komi.contactBlock(`${blokea}`).then(async () => { await komi.sendTextWithMentions(from, mess.block(blokea)) })
					} else return await komi.reply(from, mess.semmarcar(), id)
				} else return await komi.reply(from, mess.sodono(), id)
				break
				
			case 'allid':;case 'grupos':
				const gpids = await komi.getAllGroups()
				let idmsgp = ''
				for (let ids of gpids) { idmsgp += `➸ ${ids.contact.name} =\n${ids.contact.id.replace(/@g.us/g,'')}\n\n` }
				await komi.reply(from, idmsgp, id)
				break
				
			case 'help':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'motivo/razon/reason.', id)
				const hpgp = isGroupMsg ? groupId.replace('@g.us', '') : user.replace('@c.us', '')
				const nopvne = isGroupMsg ? name : pushname
				const isgorp = isGroupMsg ? '-gp' : '-pv'
				await komi.sendText(ownerNumber[0], mess.advise(nopvne, isgorp, user, body, hpgp))
				await komi.reply(from, mess.thanks(), id)
				break
				
			case 'rank':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].xp.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].xp.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].xp.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].xp.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else return await komi.reply(from, mess.soademiro(), id)
				break
				
			case 'level':
				if (!isxp) return await komi.reply(from, mess.needxpon(), id)
				if (mentionedJidList.length !== 0) lvlusrph = await komi.getContact(mentionedJidList[0])
				var yourName = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? lvlusrph.pushname : pushname)
				var wdfWho = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
				const userLevel = await gaming.getValue(wdfWho, nivel, 'level')
				const userXp = await gaming.getValue(wdfWho, nivel, 'xp')
				const ppLink = await komi.getProfilePicFromServer(wdfWho)
				if (ppLink == null || typeof ppLink === 'object') { var pepe = errorImg } else { pepe = ppLink }
				const ranq = new canvacord.Rank().setAvatar(pepe).setLevel(userLevel).setLevelColor('#ffa200', '#ffa200').setRank(Number(gaming.getRank(wdfWho, nivel))).setCurrentXP(userXp).setOverlay('#000000', 100, false).setRequiredXP(getReqXP(userLevel)).setProgressBar('#ffa200', 'COLOR').setBackground('COLOR', '#000000').setUsername(yourName).setDiscriminator(wdfWho.substring(6, 10)).setStatus('idle')
				ranq.build().then(async (buffer) => {
					canvacord.write(buffer, `./lib/media/img/${wdfWho.replace('@c.us', '')}_card.png`)
					await komi.sendFile(from, `./lib/media/img/${wdfWho.replace('@c.us', '')}_card.png`, `${wdfWho.replace('@c.us', '')}_card.png`, '', id)
					await sleep(10000).then(async () => { await fs.unlinkSync(`./lib/media/img/${wdfWho.replace('@c.us', '')}_card.png`) })
				})
				break
				
			case 'ghost':
				if (!isGroupMsg) return await komi.reply(from. mess.sogrupo(), id)
				if (!isGroupAdmins) return await komi.reply(from, mess.soademiro(), id)
				if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
				if (isNaN(args[0])) return await komi.reply(from, mess.kickcount(), id)
				await komi.reply(from, mess.wait(), id)
				var userRem = `Removidos ↓\n\n`
				try {
					functions[0].welcome.splice(groupId, 1)
					await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(welkom))
					for (let i = 0; i < groupMembers.length; i++) {
						const msgCount = await gaming.getValue(groupMembers[i].id, nivel, 'msg')
						if (groupAdmins.includes(groupMembers[i].id) || botNumber.includes(groupMembers[i].id) || ownerNumber.includes(groupMembers[i].id)) {
							console.log(color('[VIP] - ', 'crimson'), groupMembers[i].id)
						} else {
							if (msgCount < Number(args[0])) {
								await komi.removeParticipant(groupId, groupMembers[i].id)
								userRem += `@${groupMembers[i].id}\n\n`
							}
						}
					}
					await komi.sendTextWithMentions(from, userRem.replace('@c.us', ''))
					functions[0].welcome.push(groupId)
					await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(welkom))
				} catch (err) { await komi.reply(from, mess.fail() + '\nMaybe mistake/Talvez engano/0 removidos/0 removed.', id) }
				break
				
			case 'ativos':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				nivel.sort((a, b) => (a.msg < b.msg) ? 1 : -1)
				let active = '-----[ *RANKING DOS ATIVOS* ]----\n\n'
				try {
					for (let i = 0; i < 10; i++) {
						const aRandVar = await komi.getContact(nivel[i].id)
						var getPushname = aRandVar.pushname == null ? 'wa.me/' + nivel[i].id.replace('@c.us', '') : aRandVar.pushname
						active += `${i + 1} → *${getPushname}*\n➸ *Mensagens*: ${nivel[i].msg}\n\n`
					}
					await komi.sendText(from, active)
				} catch (error) { 
					await komi.reply(from, mess.tenpeo(), id)
					console.log(color('[ATIVOS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'geral':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				var ranknek = 0
				let geralRank = `-----[ *${name}* ]----\n\n`
				nivel.sort((a, b) => (a.xp < b.xp) ? 1 : -1)
				try {
					for (let i = 0; i < nivel.length; i++) {
						if (groupMembersId.includes(nivel[i].id)) {
							const bRandV = await komi.getContact(nivel[i].id)
							const msgCount = await gaming.getValue(nivel[i].id, nivel, 'msg')
							const levelCount = await gaming.getValue(nivel[i].id, nivel, 'level')
							const xpCount = await gaming.getValue(nivel[i].id, nivel, 'xp')
							const ineedPause = await gaming.getPatent(levelCount)
							const ineedmoney = await gaming.getValue(nivel[i].id, nivel, 'coin')
							var getUserName = bRandV.pushname == null ? 'wa.me/' + nivel[i].id.replace('@c.us', '') : bRandV.pushname
							ranknek = ranknek + 1
							geralRank += `${ranknek} → *${getUserName}*\n➸ *Mensagens*: ${msgCount}\n➸ *XP*: ${xpCount} / ${getReqXP(levelCount)}\n➸ *Level*: ${levelCount}\n➸ *Í-Coin*: ${ineedmoney}\n➸ *Patente*: ${ineedPause}\n\n`
						}
					}
					await komi.sendText(from, geralRank);ranknek = 0
				} catch (error) { 
					await komi.reply(from, mess.tenpeo(), id)
					console.log(color('[RANK GERAL]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'ranking':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				nivel.sort((a, b) => (a.xp < b.xp) ? 1 : -1)
				let board = '-----[ *RANKING DE XP* ]----\n\n'
				try {
					for (let i = 0; i < 10; i++) {
						var role = await gaming.getPatent(nivel[i].level)
						var aRandNe = await komi.getContact(nivel[i].id)
						const msgCounter = await gaming.getValue(nivel[i].id, nivel, 'msg')
						const theCrypto = await gaming.getValue(nivel[i].id, nivel, 'coin')
						var getTheName = aRandNe.pushname == null ? 'wa.me/' + nivel[i].id.replace('@c.us', '') : aRandNe.pushname
						board += `${i + 1} → *${getTheName}*\n➸ *Mensagens*: ${msgCounter}\n➸ *XP*: ${nivel[i].xp}\n➸ *Level*: ${nivel[i].level}\n➸ *Patente*: ${role}\n➸ *Í-Coin*: ${theCrypto}\n\n`
					}
					await komi.sendText(from, board)
				} catch (error) { 
					await komi.reply(from, mess.tenpeo(), id)
					console.log(color('[RANKING]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'give':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				if (args.length <= 2 || args[0].toLowerCase() == '-coin' || args[0].toLowerCase() == '-level' || args[0].toLowerCase() == '-xp' ) {
					const typegive = args[0].toLowerCase() == '-xp' ? 'xp' : args[0].toLowerCase() == '-level' ? 'level' : args[0].toLowerCase() == '-coin' ? 'coin' : 'xp'
					if (mentionedJidList.length !== 0) xpUserGet = await komi.getContact(mentionedJidList[0])
					var userGainXp = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? xpUserGet.id : user)
					var theValuetoAdd = quotedMsg ? args[1] : (mentionedJidList.length !== 0 ? args[2] : args[2])
					if (isNaN(theValuetoAdd)) return await komi.reply(from, mess.onlynumber(), id)
					await gaming.addValue(userGainXp, Number(theValuetoAdd), nivel, typegive)
					await komi.sendTextWithMentions(from, mess.gainxp(userGainXp, theValuetoAdd) + typegive.toUpperCase() + '.')
				} else return await komi.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}give -xp/-level/-coin @user <value/valor>`, id)
				break
				
			case 'softban':
				try {
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
						const aatimep = quotedMsg ? Number(args[0] * 60000) : (mentionedJidList.length !== 0 ? Number(args[1] * 60000) : Number(args[1] * 60000))
						const timeMsg = Number(aatimep) + 5000
						if (quotedMsg) {
							if (args.length == 0 || isNaN(args[0])) return await komi.reply(from, mess.nomark() + ' + time/tempo (minutos/minutes)\n(Ex: 30)', id)
							const bgmcomum = quotedMsgObj.sender.id
							if (ownerNumber.includes(bgmcomum) || groupAdmins.includes(bgmcomum)) return await komi.reply(from, mess.vip(), id)
							if (!groupMembersId.includes(bgmcomum)) return await komi.reply(from, mess.notongp(), id)
							await komi.sendTextWithMentions(from, mess.irritouqm(bgmcomum, args))
							await sleep(3000)
							await komi.removeParticipant(groupId, bgmcomum)
							await sleep(aatimep)
							const checkIsHere = await komi.getGroupMembersId(groupId)
							if (checkIsHere.includes(bgmcomum)) return await komi.reply(from, mess.janogp(), id)
							await komi.reply(from, mess.timeadd(), id)
							await komi.addParticipant(groupId, bgmcomum)
							await sleep(timeMsg)
							await komi.sendText(from, mess.voltargp())
						} else {
							if (args.length == 0 || isNaN(args[1]) || mentionedJidList.length == 0) return await komi.reply(from, mess.semmarcar() + '\n\n@user time/tempo (minutos/minutes)\n(Ex: @user 30)', id)
							if (!groupMembersId.includes(mentionedJidList[0])) return await komi.reply(from, mess.notongp(), id)
							await komi.sendTextWithMentions(from, mess.irritouml(mentionedJidList, args))
							await sleep(3000)
							if (ownerNumber.includes(mentionedJidList[0]) || groupAdmins.includes(mentionedJidList[0])) return await komi.reply(from, mess.vip(), id)
							await komi.removeParticipant(groupId, mentionedJidList[0])
							await sleep(aatimep);const checkIsHerea = await komi.getGroupMembersId(groupId)
							if (checkIsHerea.includes(mentionedJidList[0])) return await komi.reply(from, mess.janogp(), id)
							await komi.reply(from, mess.timeadd(), id)
							await komi.addParticipant(groupId, mentionedJidList[0])
							await sleep(timeMsg)
							await komi.sendText(from, mess.voltargp())
						}
					} else if (isGroupMsg) {
						await komi.reply(from, mess.soademiro(), id)
					} else return await komi.reply(from, mess.sogrupo(), id)
				} catch (error) { 
					await komi.reply(from, mess.addpessoa(), id)
					console.log(color('[SOFTBAN]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'marcar':
				await komi.sendTextWithMentions(from, `@${user.replace('@c.us', '')}`)
				break
				
			case 'nivel':
				var qualDeles = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : user)
				if (mentionedJidList.length !== 0) lvlusrnl = await komi.getContact(mentionedJidList[0])
				var yourfkName = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? lvlusrnl.pushname : pushname)
				const wtfXP = await gaming.getValue(qualDeles, nivel, 'xp')
				const shesMSG = await gaming.getValue(qualDeles, nivel, 'msg')
				const uzerlvl = await gaming.getValue(qualDeles, nivel, 'level')
				const icoinqtd = await gaming.getValue(qualDeles, nivel, 'coin')
				await komi.reply(from, `*「 STATS 」*\n\n➸ *Nick*: ${yourfkName}\n➸ *XP*: ${wtfXP} / ${getReqXP(uzerlvl)}\n➸ *Level*: ${uzerlvl}\n➸ *MSG*: ${shesMSG}\n➸ *Í-Coin*: ${icoinqtd}`, id)
				break
				
			case 'letra':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome da música', id)
				try {
					const liric = await axios.get(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(body.slice(7))}`)
					await komi.sendFileFromUrl(from, liric.data.thumbnail.genius, '', `*🎸*\n\n${liric.data.title}\n\n*🎵*\n\n${liric.data.lyrics}`, id)
				} catch (error) {
					await komi.reply(from, mess.noresult(), id)
					console.log(color('[LYRICS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'reedit':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome.', id)
				try {
					await komi.reply(from, mess.wait(), id)
					const reed = await axios.get(`https://meme-api.herokuapp.com/gimme/${encodeURIComponent(body.slice(8))}`)
					if (reed.data.nsfw == false || !isGroupMsg) {
						await komi.sendFileFromUrl(from, reed.data.url, '', reed.data.title, id)
					} else {
						if (isGroupMsg && !isNsfw) {
							await komi.reply(from, mess.gpadulto(), id)
						} else { await komi.sendFileFromUrl(from, reed.data.url, '', reed.data.title, id) }
					}
				} catch (error) {
					await komi.reply(from, mess.noresult(), id)
					console.log(color('[LYRICS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'wallhaven':;case 'wallpaper':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome do wallpaper.', id)
				await komi.reply(from, mess.wait(), id)
				try {
					const wpphe = await axios.get(`https://wallhaven.cc/api/v1/search?apikey=${config.API_WallHaven}&q=${encodeURIComponent(body.slice(11))}`)
					var rwlpp = ''
					for (let i = 0; i < 10; i++) { rwlpp += `${wpphe.data.data[i].path}\n` }
					const heavenwpp = rwlpp.toString().split('\n')
					const rmvempty = heavenwpp.splice(heavenwpp.indexOf(''), 1)
					const rWallHe = heavenwpp[Math.floor(Math.random() * heavenwpp.length)]
					await komi.sendFileFromUrl(from, rWallHe, 'WallHaven.jpg', '<3', id)
				} catch (error) {
					await komi.reply(from, mess.noresult(), id)
					console.log(color('[WALLHAVEN]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'decode':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'código binario.', id)
				await komi.reply(from, `${body.slice(8)}\n\n*→*\n\n${body.slice(8).split(" ").map(x => String.fromCharCode(parseInt(x, 2))).join("")}`, id)
				break
				
			case 'encode':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Digite algo', id)
				await komi.reply(from, `${body.slice(8)}\n\n*→*\n\n${body.slice(8).split('').map(function (char) { return char.charCodeAt(0).toString(2) }).join(' ')}`, id)
				break
				
			case 'covid':
				if (args.lenght == 0) return await komi.reply(from, mess.coviderr(), id)
				const covidnb = await axios.get(`https://coronavirus-19-api.herokuapp.com/countries/${encodeURIComponent(body.slice(7))}`)
				if (covidnb.data == 'Country not found') return await komi.reply(from, mess.coviderr(), id)
				await komi.reply(from, mess.covidata(covidnb), id)
				break
				
			case 'paises':
				await komi.reply(from, mess.covid(), id)
				break
				
			case 'email':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'email | title/titulo | mensagem/message.' + '\n\n' + mess.argsbar() + 'use 2 "|".', id)
				try {
					await komi.reply(from, mess.wait(), id)
					const mails = await axios.get(`https://videfikri.com/api/spamemail/?email=${encodeURIComponent(arg.split('|')[0])}&subjek=${encodeURIComponent(arg.split('|')[1])}&pesan=${encodeURIComponent(arg.split('|')[2])}`)
					const mailres = mails.data.result
					if (mailres.status == '200') {
						await komi.reply(from, `✔️ - *📠 → *: ${mailres.target}\n\n*📧 → * ${mailres.subjek}\n\n*📋 → * ${mailres.pesan}`, id)
					} else return await komi.reply(from, mess.mails(), id)
				} catch (error) {
					await komi.reply(from, mess.mails(), id)
					console.log(color('[EMAIL]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'gtav':
				if (isImage || isQuotedImage) {
					await komi.reply(from, mess.wait(), id)
					const gtavmd = isQuotedImage ? quotedMsg : message
					const gtaddt = await decryptMedia(gtavmd, uaOverride)
					const gtaUpl = await upload(gtaddt, false)
					await komi.sendFileFromUrl(from, `https://videfikri.com/api/textmaker/gtavposter/?urlgbr=${gtaUpl}`, 'Gtav.jpg', 'GTA V PS2!', id).catch(async () => { await komi.reply(from, mess.upfail(), id) })
				} else return await komi.reply(from, mess.onlyimg(), id)
				break
				
			case 'reverter':;case 'rev':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const revimg = isQuotedImage ? quotedMsg : message
						const revigb = await decryptMedia(revimg, uaOverride)
						var revUpl = await upload(revigb, false)
					} else { var revUpl = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (revUpl == null || typeof revUpl === 'object') revUpl = errorImg
					await canvacord.Canvas.invert(revUpl).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `rev.png`, 'Ah não, sou daltônica!', id) })
				} catch (error) {
					console.log(color('[REVERTER]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					await komi.reply(from, mess.fail(), id)
				}
				break
				
			case 'encurtar':;case 'tinyurl':
				if (args.length == 0) return await komi.reply(from, mess.nolink(), id)
				const tinurl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`)
				if (tinurl.data == 'Error') return await komi.reply(from, mess.nolink() + '\n\n' + mess.fail(), id)
				await komi.reply(from, `${args[0]} → ${tinurl.data}`, id)
				break
		
			case 'signo':;case 'horoscopo':
				const signoerr = `❌ → ${args[0]} ← ❌!\n\n✔️ → Aries --- Taurus --- Gemini --- Cancer --- Leo --- Virgo --- Libra --- Scorpio --- Sagittarius --- Capricorn --- Aquarius --- Pisces.`
				if (args.length == 0) return await komi.reply(from, signoerr, id)
				const zodd = await axios.get(`http://horoscope-api.herokuapp.com/horoscope/today/${encodeURIComponent(args[0])}`)
				if (zodd.data.horoscope == '[]') return await komi.reply(from, signoerr, id)
				if (region == 'en') return await komi.reply(from, zodd.data.horoscope, id)
				await sleep(5000)
				await translate(zodd.data.horoscope, region).then(async (horoZod) => { await komi.reply(from, horoZod, id) })
				break
				
			case 'bomb':
				if (args.length == 2 && isGroupMsg && isGroupAdmins || args.length == 2 && isOwner) {
					if (args[0].toLowerCase() == 'stop') return await bomber.stop()
					if (isNaN(args[0])) return await komi.reply(from, mess.usenumber(), id)
					if (ownerNumber.includes(`${args[0]}@c.us`) && !isOwner || args[0].includes(`${botNumber.replace('@c.us', '')}`) && !isOwner) {
						await komi.sendText(ownerNumber[0], mess.nobomb(pushname, user))
						await komi.reply(from, mess.fuckbomb(), id)
						return await komi.contactBlock(user)
					}
					console.log(color('[BOMB]', 'crimson'), color(`→ Pedido de BOMB feito pelo ${pushname} no alvo → ${args[0]}.`, 'gold'))
					const startAtk = await axios.get(`http://127.0.0.1:3000/attack?number=${args[0]}&loops=${args[1]}`)
					if (startAtk.data.success == true) { await komi.sendTextWithMentions(from, mess.bombstd(args)) } else return await komi.reply(from, mess.fail(), id)
				} else return await komi.reply(from, mess.bomber(), id)
				break
				
			case 'botnome':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
				const newname = body.slice(6)
				if (newname.length >= 25) return await komi.reply(from, mess.letlimit() + '25.', id)
				await komi.setMyName(newname)
				await komi.reply(from, mess.maked(), id)
				break
				
			case 'recado':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id)
				const newstat = body.slice(8)
				if (newstat.length >= 250) return await komi.reply(from, mess.letlimit() + '250.', id)
				await komi.setMyStatus(newstat)
				await komi.reply(from, mess.maked(), id)
				break
				
			case 'botfoto':
				if (isMedia && type == 'image' || isQuotedImage) {
					if (!isOwner) return await komi.reply(from, mess.sodono(), id)
					const dataMedia = isQuotedImage ? quotedMsg : message
					const mediaData = await decryptMedia(dataMedia, uaOverride)
					const bkmypic = await komi.getProfilePicFromServer(botNumber)
					if (bkmypic == null) { var backpt = errorurl } else { var backpt = bkmypic }
					await komi.sendFileFromUrl(from, backpt, '', 'Backup', id)
					await komi.setProfilePic(mediaData)
					await komi.reply(from, mess.maked(), id)
				} else return await komi.reply(from, mess.onlyimg(), id)
				break
				
			case 'book':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome do livro.', id)
				const takeBook = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(body.slice(6))}&langRestrict=${region}`)
				const getBook = await axios.get(`${takeBook.data.items[0].selfLink}`)
				await komi.sendFileFromUrl(from, `${getBook.data.volumeInfo.imageLinks.thumbnail}`, 'book.jpg', mess.book(getBook), id)
				break
				
			
			case 'piada':
				const piada = await axios.get('https://v2.jokeapi.dev/joke/Any?format=txt')
				if (region == 'en') return await komi.reply(from, piada.data, id)
				await sleep(5000)
				await translate(piada.data, region).then(async (getPiada) => { await komi.reply(from, getPiada, id) })
				break
				
			case 'alarme':
				if (args.length == 0 || isNaN(args[0]) || !arks.includes('|')) return await komi.reply(from, mess.timealarm() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
				const timetorem = Number(arg.split('|')[0]) * 60000
				const alarmname = arg.split('|')[1]
				await komi.reply(from, mess.alarmact(args), id)
				setTimeout(() => { komi.reply(from, `⏰ - ${alarmname}!`, id) }, timetorem)
				break
				
			case 'emoji':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'emoji.', id)
				emoji.get(args[0]).then(async (emoji) => {
					await sleep(3000)
					if (emoji.emoji == null) return await komi.reply(from, mess.noemoji(), id)
					let moji = `Emoji: ${emoji.emoji}\n\nUnicode: ${emoji.unicode}\n\nNome: ${emoji.name}\n\nInformações: ${emoji.description}\n\n`
					for (let i = 0; i < emoji.images.length; i++) { moji += `${emoji.images[i].vendor} → ${emoji.images[i].url}\n\n═════════════════\n\n` }
					await komi.reply(from, moji + mess.emojis(), id)
					await komi.sendStickerfromUrl(from, emoji.images[0].url, { method: 'get' }, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				})
				break
				
			case 'cosplay':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome', id)
				await komi.sendStickerfromUrl(from, `https://rest.farzain.com/api/special/fansign/cosplay/cosplay.php?apikey=rambu&text=${encodeURIComponent(body.slice(9))}`, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				break
				
			case 'hitler':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const hitlerPict = isQuotedImage ? quotedMsg : message
						const gethitlerPic = await decryptMedia(hitlerPict, uaOverride)
						var thehitlerpic = await upload(gethitlerPic, false)
					} else { var thehitlerpic = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (thehitlerpic == null || typeof thehitlerpic === 'object') thehitlerpic = errorImg
					await canvacord.Canvas.hitler(thehitlerpic).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `hitler.png`, '卍', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[HITLER]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'trash':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const trashPict = isQuotedImage ? quotedMsg : message
						const getTrashPic = await decryptMedia(trashPict, uaOverride)
						var theTrashpic = await upload(getTrashPic, false)
					} else { var theTrashpic = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theTrashpic == null || typeof theTrashpic === 'object') theTrashpic = errorImg
					await canvacord.Canvas.trash(theTrashpic).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `trash.png`, '🚮', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[TRASH]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'shit':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const shitPict = isQuotedImage ? quotedMsg : message
						const getshitPic = await decryptMedia(shitPict, uaOverride)
						var theshitpic = await upload(getshitPic, false)
					} else { var theshitpic = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theshitpic == null || typeof theshitpic === 'object') theshitpic = errorImg
					await canvacord.Canvas.shit(theshitpic).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `shit.png`, '💩💩💩', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[SHIT]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'blur':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const shitBlurt = isQuotedImage ? quotedMsg : message
						const getshitPic = await decryptMedia(shitBlurt, uaOverride)
						var theBlurpic = await upload(getshitPic, false)
					} else { var theBlurpic = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theBlurpic == null || typeof theBlurpic === 'object') theBlurpic = errorImg
					await canvacord.Canvas.blur(theBlurpic).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `blur.png`, '💡', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[BLUR]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'rip':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const ARipt = isQuotedImage ? quotedMsg : message
						const getRipPic = await decryptMedia(ARipt, uaOverride)
						var theRippic = await upload(getRipPic, false)
					} else { var theRippic = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theRippic == null || typeof theRippic === 'object') theRippic = errorImg
					await canvacord.Canvas.rip(theRippic).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `rip.png`, '☠️', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[RIP]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'exec':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + `JS Code/Código.`, id)
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				try { eval(body.slice(6)) } catch (error) { console.log(color('[EXEC]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold')) }
				break
				
			case 'github':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Github Username.', id)
				await komi.reply(from, mess.wait(), id)
				const gitData = await axios.get(`https://api.github.com/users/${args[0]}`)
				const siteAdmin = (gitData.data.site_admin == false) ? 'Não' : gitData.data.site_admin
				const companY = (gitData.data.company == null) ? 'Não' : gitData.data.company
				const bloG = (gitData.data.blog == "") ? 'Não' : gitData.data.blog
				const emaiL = (gitData.data.email == null) ? 'Não' : gitData.data.email
				const tramPar = (gitData.data.hireable == null) ? 'Não' : gitData.data.hireable
				if (gitData.data.message == 'Not Found') return await komi.reply(from, mess.noresult(), id)
				await komi.sendFileFromUrl(from, `${gitData.data.avatar_url}`, 'avatar.png', mess.github(siteAdmin, companY, bloG, emaiL, tramPar, gitData), id)
				break
				
			case 'roubar':
				case 'renomear':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (isQuotedSticker && arks.includes('|')) {
					await komi.reply(from, mess.wait(), id)
					const stickerMeta = await decryptMedia(quotedMsg)
					await komi.sendImageAsSticker(from, `data:${quotedMsg.mimetype};base64,${stickerMeta.toString('base64')}`, { author: arg.split('|')[1], pack: arg.split('|')[0] })
				} else return await komi.reply(from, mess.onlyst() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
				break
				
		
			case 'sound':;case 'bass':
				if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
					if (args.length == 1 && !isNaN(args[0])) {
						try {
							await komi.reply(from, mess.wait(), id)
							const encryptMedia = isQuotedAudio || isQuotedPtt ? quotedMsg : message
							const mediaData = await decryptMedia(encryptMedia, uaOverride)
							await fs.writeFile(`./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`, mediaData, (err) => {
								if (err) return console.error(err)
								console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio "Bass" pedida por → ${pushname} - Você pode ignorar.`, 'gold'))
								ffmpeg(`./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`).audioFilter(`equalizer=f=40:width_type=h:width=50:g=${args[0]}`).format('mp3').save(`./lib/media/audio/audio-${user.replace('@c.us', '')}${lvpc}.mp3`) // Você pode editar o equalizador ali
								.on('error', async function (error, stdout, stderr) {
									await komi.reply(from, mess.fail(), id)
									console.log(color('[BASS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
								})
								.on('end', async () => {
									console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio "Bass" finalizada, enviando para → ${pushname} - Você pode ignorar...`, 'gold'))
									await komi.sendFile(from, `./lib/media/audio/audio-${user.replace('@c.us', '')}${lvpc}.mp3`, 'audio.mp3', '', id)
									await sleep(10000).then(async () => { await fs.unlinkSync(`./lib/media/audio/audio-${user.replace('@c.us', '')}${lvpc}.mp3`);await fs.unlinkSync(`./lib/media/audio/${user.replace('@c.us', '')}${lvpc}.mp3`) })
								})
							})
						} catch (error) {
							await komi.reply(from, mess.fail(), id)
							console.log(color('[BASS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
						}
					} else return await komi.reply(from, mess.noargs() + 'quantidade de bass | bass quantity.', id)
				} else return await komi.reply(from, mess.onlyaudio(), id)
				break
				
		
			case 'nightcore':
				if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
					try {
						await komi.reply(from, mess.wait(), id)
						const encryptMedia = isQuotedAudio || isQuotedPtt ? quotedMsg : message
						const mediaData = await decryptMedia(encryptMedia, uaOverride)
						await fs.writeFile(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`, mediaData, (err) => {
							if (err) return console.error(err)
							console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio para versão "nightcore" pedida por → ${pushname} - Você pode ignorar.`, 'gold'))
							ffmpeg(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`).audioFilter('asetrate=44100*1.25').format('mp3').save(`./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`) // Você pode editar o valor acima (44100*1.25)
							.on('error', async function (error, stdout, stderr) {
								await komi.reply(from, mess.fail(), id)
								console.log(color('[NIGHTCORE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
							})
							.on('end', async () => {
								console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de audio para versão "nightcore" finalizada, enviando para → ${pushname} - Você pode ignorar...`, 'gold'))
								await komi.sendFile(from, `./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`, 'audio.mp3', '', id)
								await sleep(10000).then(async () => { await fs.unlinkSync(`./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`);await fs.unlinkSync(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`) })
							})
						})
					} catch (error) {
						await komi.reply(from, mess.fail(), id)
						if (fs.existsSync(`./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`)) { await fs.unlinkSync(`./lib/media/audio/night-${user.replace('@c.us', '')}${lvpc}.mp3`) }
						if (fs.existsSync(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`)) { await fs.unlinkSync(`./lib/media/audio/n${user.replace('@c.us', '')}${lvpc}.mp3`) }
						console.log(color('[NIGHTCORE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					}
				} else return await komi.reply(from, mess.onlyaudio(), id)
				break
				
				case 'tomp3':
				if (isMedia && isVideo || isQuotedVideo) {
					try {
						await komi.reply(from, mess.wait(), id)
						const vTypeA = isQuotedVideo ? quotedMsg : message
						const mediaData = await decryptMedia(vTypeA, uaOverride)
						await fs.writeFile(`./lib/media/video/${user.replace('@c.us', '')}${lvpc}.${vTypeA.mimetype.replace(/.+\//, '')}`, mediaData, (err) => {
							if (err) return console.error(err)
							console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de video para audio pedida por → ${pushname} - Você pode ignorar.`, 'gold'))
							ffmpeg(`./lib/media/video/${user.replace('@c.us', '')}${lvpc}.${vTypeA.mimetype.replace(/.+\//, '')}`).format('mp3').save(`./lib/media/video/v${user.replace('@c.us', '')}${lvpc}.mp3`)
							.on('error', async function (error, stdout, stderr) {
								await komi.reply(from, mess.fail(), id)
								console.log(color('[AUDIO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
							})
							.on('end', async () => {
								console.log(color('[FFMPEG]', 'crimson'), color(`- Conversão de video para audio terminada, enviando para → ${pushname} - Você pode ignorar...`, 'gold'))
								await komi.sendFile(from, `./lib/media/video/v${user.replace('@c.us', '')}${lvpc}.mp3`, 'audio.mp3', '', id)
								await sleep(10000).then(async () => { await fs.unlinkSync(`./lib/media/video/v${user.replace('@c.us', '')}${lvpc}.mp3`);await fs.unlinkSync(`./lib/media/video/${user.replace('@c.us', '')}${lvpc}.${vTypeA.mimetype.replace(/.+\//, '')}`) })
							})
						})
					} catch (error) {
						await komi.reply(from, mess.fail(), id)
						console.log(color('[AUDIO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					}
				} else return await komi.reply(from, mess.onlyvideo(), id)
				break
				
			
			case 'cpf':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (!region == 'pt') return await komi.reply(from, 'Brazil only/Brasil solamente!', id)
				try {
					await komi.reply(from, mess.wait(), id)
					const browsercf = await puppeteer.launch({ headless: false, userDataDir: "./logs/Chrome/Maker/CPF" })
					const pagecf = await browsercf.newPage()
					await pagecf.goto("https://www.situacao-cadastral.com", { waitUntil: "networkidle2", timeout: 0 }).then(async () => {
						await pagecf.waitForSelector("#form > #doc");await pagecf.click("#form > #doc");await pagecf.type("#form > #doc", args[0])
						await pagecf.click("#consultar");await pagecf.waitForSelector('div[id="resultado"] > span.dados.nome')
						const cpfName = await pagecf.evaluate(() => { return document.querySelector("#resultado > span.dados.nome").innerText })
						const situation = await pagecf.evaluate(() => { return document.querySelector("#resultado > span.dados.situacao > span").innerText })
						await komi.reply(from, `O CPF *"${args[0]}"* possui como dono *"${cpfName}"* que está com *"${situation}".*`, id)
						await browsercf.close()
						await fs.rmdirSync('./logs/Chrome/Maker', { recursive: true })
					})
				} catch (error) {
					await komi.reply(from, 'CPF não encontrado ou erros.', id)
					console.log(color('[CPF]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'policia':
				await komi.reply(from, mess.policemenu(), id)
				break
				
			case '01':
				if (mentionedJidList.length == 0 && !quotedMsg) return await komi.reply(from, mess.howtololi(), id)
				if (mentionedJidList.length !== 0) theLolicon = await komi.getContact(mentionedJidList[0])
				var getLolicon = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? theLolicon.pushname : pushname)
				if (getLolicon == null) getLolicon = `??? - Top secret name - ???`
				await fs.appendFile('./lib/config/Utilidades/lolicon.txt', `\n\n${getLolicon} - ${lvpc} Years/Anos 🔒`)
				await komi.reply(from, mess.fbi(), id)
				break
				
			case '02':
				var aBraPlP = pushname
				if (aBraPlP == null) aBraPlP = `\n\n??? - Top secret name - ??? - ${lvpc} Years/Anos 🔒`
				await fs.appendFile('./lib/config/Utilidades/entregados.txt', `\n\n${aBraPlP} - ${lvpc} Years/Anos 🔒`)
				await komi.reply(from, mess.arrested(), id)
				break
				
			case '03':
				if (mentionedJidList.length == 0 && !quotedMsg) return await komi.reply(from, mess.howtoshota(), id)
				if (mentionedJidList.length !== 0) theShotaCmnl = await komi.getContact(mentionedJidList[0])
				var takeChild = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? theShotaCmnl.pushname : pushname)
				if (takeChild == null) takeChild = `??? - Top secret name - ???`
				await fs.appendFile('./lib/config/Utilidades/reversecon.txt', `\n\n${takeChild} - ${lvpc} Years/Anos 🔒`)
				await komi.reply(from, mess.cia(), id)
				break
				
			case '04':
				if (mentionedJidList.length == 0 && args.length <= 3 && !arks.includes('|') || !quotedMsg && args.length <= 2 && !arks.includes('|')) return await komi.reply(from, mess.howtocrime(), id)
				var theCrime = arg.split('|')[1]
				if (mentionedJidList.length !== 0) criminalSmooth = await komi.getContact(mentionedJidList[0])
				var crimeReported = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? criminalSmooth.pushname : pushname)
				if (crimeReported == null) crimeReported = `??? - Top secret name - ???`
				if (theCrime == null) theCrime = `??? - Top secret crime - ???`
				await fs.appendFile('./lib/config/Utilidades/crimereport.txt', `\n\n${crimeReported} (${theCrime}) - ${lvpc} Years/Anos 🔒`)
				await komi.reply(from, mess.stars(), id)
				break
				
			case '05':
				if (mentionedJidList.length == 0 && !quotedMsg) return await komi.reply(from, mess.howtolgbts(), id)
				if (mentionedJidList.length !== 0) the1000gender = await komi.getContact(mentionedJidList[0])
				var genderFuck = quotedMsg ? quotedMsgObj.sender.pushname : (mentionedJidList.length !== 0 ? the1000gender.pushname : pushname)
				if (genderFuck == null) genderFuck = `??? - Top secret name - ???`
				await fs.appendFile('./lib/config/Utilidades/gaysreport.txt', `\n\n${genderFuck} [${guei}] - ${lvpc} Years/Anos 🔒`)
				await komi.reply(from, mess.bsaa(), id)
				break
				
			case 'fbi':
				const loliconList = await fs.readFileSync('./lib/config/Utilidades/lolicon.txt').toString()
				await komi.reply(from, loliconList, id)
				break
				
			case 'rpd':
				const peopleCrz = await fs.readFileSync('./lib/config/Utilidades/entregados.txt').toString()
				await komi.reply(from, peopleCrz, id)
				break
				
			case 'cia':
				const reversePedo = await fs.readFileSync('./lib/config/Utilidades/reversecon.txt').toString()
				await komi.reply(from, reversePedo, id)
				break
				
			case 'bsaa':
				const gaysArrest = await fs.readFileSync('./lib/config/Utilidades/gaysreport.txt').toString()
				await komi.reply(from, gaysArrest, id)
				break
				
			case 'stars':
				const aLotCrime = await fs.readFileSync('./lib/config/Utilidades/crimereport.txt').toString()
				await komi.reply(from, aLotCrime, id)
				break
				
			case 'resetall':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				await fs.writeFileSync('./lib/config/Utilidades/lolicon.txt', 'Lolicons ↓')
				await fs.writeFileSync('./lib/config/Utilidades/reversecon.txt', 'Menores Denunciados ↓')
				await fs.writeFileSync('./lib/config/Utilidades/entregados.txt', 'Auto-denuncias ↓')
				await fs.writeFileSync('./lib/config/Utilidades/gaysreport.txt', 'LGTB\'S Denunciados ↓')
				await fs.writeFileSync('./lib/config/Utilidades/crimereport.txt', 'Crimes Reportados ↓')
				await komi.reply(from, mess.maked(), id)
				break
				
			
			case 'lolireal':
				const aLolisV = await fs.readFileSync('./lib/config/Utilidades/lolis.txt').toString().split('\n')
				const getLoliVideo = aLolisV[Math.floor(Math.random() * aLolisV.length)]
				await komi.reply(from, mess.wait(), id)
				await komi.sendFileFromUrl(from, getLoliVideo, 'loli.mp4', 'Lolicon!', id).catch(async () => { await komi.reply(from, mess.fbispoted(), id) })
				break
				
		
			case 'tord':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (args.length == 0) return await komi.reply(from, mess.tordare(), id)
				if (args[0].toLowerCase() == '-dare') {
					const desafios = await fs.readFileSync('./lib/config/Utilidades/desafio.txt').toString().split('\n')
					const getDare = desafios[Math.floor(Math.random() * desafios.length)]
					if (region == 'en') return await komi.reply(from, getDare, id)
					await translate(getDare, region).then(async (darem) => { await komi.reply(from, darem, id) })
				} else if (args[0].toLowerCase() == '-truth') {
					const verdadeG = await fs.readFileSync('./lib/config/Utilidades/verdade.txt').toString().split('\n')
					const getTruth = verdadeG[Math.floor(Math.random() * verdadeG.length)]
					if (region == 'en') return await komi.reply(from, getTruth, id)
					await translate(getTruth, region).then(async (truthm) => { await komi.reply(from, truthm, id) })
				} else if (args[0].toLowerCase() == '-r') {
					await komi.reply(from, 'OK! Vamos outra!\nVerdade ou Desafio? (-truth or -dare)?', id)
				} else return await komi.reply(from, mess.tordare(), id)
				break
				
			
			case 'nunca':
				if (region == 'en') return await komi.reply(from, getNeverland, id)
				await translate(getNeverland, region).then(async (willdo) => { await komi.reply(from, willdo, id) })
				break
				
		
			case 'cantada':
				if (region == 'en') return await komi.reply(from, getHappyness, id)
				await translate(getHappyness, region).then(async (notHappy) => { await komi.reply(from, notHappy, id) })
				break
				
			case 'sort':
				if (args.length == 0 || !arks.includes('|')) return await komi.reply(from, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar(), id)
				var listChoice = ''
				const sortArgs = arg.split('|')
				for (let i = 0; i < sortArgs.length; i++) { listChoice += `${sortArgs[i]}\n` }
				listChoice = listChoice.toString().split('\n')
				const choiceSomethg = listChoice[Math.floor(Math.random() * listChoice.length)]
				await komi.reply(from, choiceSomethg, id)
				break
				
			case 'antitravas':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length !== 1) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						if (functions[0].antitrava.includes(groupId)) return await komi.reply(from, mess.jaenabled(), id)
						functions[0].antitrava.push(groupId)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						if (!functions[0].antitrava.includes(groupId)) return await komi.reply(from, mess.jadisabled(), id)
						functions[0].antitrava.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica1(), id)
				} else return await komi.reply(from, mess.soademiro(), id)
				break
				
			case 'destrava':
				if (isGroupMsg && isGroupAdmins || isOwner) {
					var shrekDes = ''
					for (let i = 0; i < 20; i++) { shrekDes += `⡴⠑⡄⠀⠀⠀⠀⠀⠀⣀⣀⣤⣤⣤⣀⡀\n⡇⠀⠿⠀⠀⠀⣀⡴⢿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀\n⠀⠀⠀⢄⣠⠾⠁⣀⣄⡈⠙⣿⣿⣿⣿⣿⣿⣿⣿⣆\n⠀⠀⠀⢀⡀⠁⠀⠀⠈⠙⠛⠂⠈⣿⣿⣿⣿⣿⠿⡿⢿⣆\n⠀⠀⢀⡾⣁⣀⠀⠴⠂⠙⣗⡀⠀⢻⣿⣿⠭⢤⣴⣦⣤⣹⠀⠀⠀⢴⣆ \n⠀⢀⣾⣿⣿⣿⣷⣮⣽⣾⣿⣥⣴⣿⣿⡿⢂⠔⢚⡿⢿⣿⣦⣴⣾⠁⡿ \n⢀⡞⠁⠙⠻⠿⠟⠉⠀⠛⢹⣿⣿⣿⣿⣿⣌⢤⣼⣿⣾⣿⡟⠉\n⣾⣷⣶⠇⠀⠀⣤⣄⣀⡀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇\n⠉⠈⠉⠀⠀⢦⡈⢻⣿⣿⣿⣶⣶⣶⣶⣤⣽⡹⣿⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠉⠲⣽⡻⢿⣿⣿⣿⣿⣿⣿⣷⣜⣿⣿⣿⡇\n⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣷⣶⣮⣭⣽⣿⣿⣿⣿⣿⣿⣿\n⠀⠀⠀⠀⠀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇\n⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃\n⠀⠀⠀⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠟⠁\n⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠻⠿⠿⠿⠿⠛⠉\n\n` }
					await komi.reply(from, shrekDes, id)
				} else return await komi.reply(from, mess.soademiro(), id)
				break
				
			case 'biblia':;case 'bible':
				try {
					if (args[0].toLowerCase() == '-g') {
						await exec(`cd lib/config/Utilidades && bash -c 'grep -i "${body.slice(13)}" biblia.txt | shuf -n 1'`, async (error, stdout, stderr) => {
							if (error || stderr || stdout == null || stdout == '') {
								if (region == 'en') return await komi.reply(from, randomBible, id)
								await sleep(5000)
								await translate(randomBible, region).then(async (bible) => { await komi.reply(from, bible, id) })
							} else {
								if (region == 'en') return await komi.reply(from, stdout, id)
								await sleep(5000)
								await translate(stdout, region).then(async (bible) => { await komi.reply(from, bible, id) })
							}
						})
					} else return await translate(randomBible, region).then(async (bible) => { await komi.reply(from, bible, id) })
				} catch (error) { 
					await komi.reply(from, randomBible, id)
					console.log(color('[BIBLIA]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'steal':
				if (!isxp) return await komi.reply(from, mess.needxpon(), id)
				if (mentionedJidList.length == 0 && !quotedMsg) return await komi.reply(from, mess.semmarcar(), id)
				const noStealTm = await gaming.getLimit(user, daily)
				if (gaming.isLimit(noStealTm) == 1) return await komi.reply(from, mess.steal(), id)
				var theStealK = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
				if (theStealK == null || theStealK == botNumber) return await komi.reply(from, mess.cmdfailed(), id)
				const stealAlvo = await gaming.getValue(theStealK, nivel, 'xp')
				if (stealAlvo <= 1000) return await komi.sendTextWithMentions(from, mess.notalvo(theStealK, stealAlvo), id) // Precisa de 1000 XP para roubar
				const checkUserXP = await gaming.getValue(user, nivel, 'xp');const getUsrLevel = await gaming.getValue(user, nivel, 'level')
				var xpSteal = parseInt(stealAlvo / 10, 10);var stealGain = Math.floor(Math.random() * xpSteal + Number(lvpc)) + Number(lvpc);var stealLose = Number(-stealGain)
				for (let i = 0; i < 10; i++) { if (stealLose < -checkUserXP || isNaN(stealGain) || isNaN(stealLose) || stealGain > Number(config.Max_Steal)) { stealGain = parseInt(stealGain / 2, 10);stealLose = Number(-stealGain) } }
				if (functions[0].thieves.includes(theStealK)) { lvpc = parseInt(lvpc + (getUsrLevel / 3), 10) } // Beneficio da Guilda de Ladrões, Steal melhora a cada nível, sem limite
				if (functions[0].companions.includes(theStealK)) { lvpc = parseInt(lvpc + (getUsrLevel / 5), 10) } // Beneficio da Guilda Companions, melhora o Steal mas com limitação
				if (lvpc > 70) { await komi.sendTextWithMentions(from, mess.stealwkd(theStealK, stealGain)) } else { await komi.sendTextWithMentions(from, mess.stealfail(theStealK, stealLose)) }
				if (lvpc > 70) { await gaming.addValue(user, Number(stealGain), nivel, 'xp') } else { await gaming.addValue(user, Number(stealLose), nivel, 'xp') }
				if (lvpc > 70) { await gaming.addValue(theStealK, Number(stealLose), nivel, 'xp') } else { await gaming.addValue(theStealK, Number(stealGain), nivel, 'xp') }
				if (noLimits == 0) await gaming.addLimit(user, daily, './lib/config/Gerais/diario.json')
				break
				
			case 'nolimit':
				if (isOwner) {
					if (args.length == 0) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						await fs.writeFileSync('./lib/config/Gerais/diario.json', '[]');noLimits = 1
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						noLimits = 0;await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica2(), id)
				} else return await komi.reply(from, mess.sodono(), id)
				break
				
			case 'doar':
				if (!isxp) return await komi.reply(from, mess.needxpon(), id)
				if (args.length == 0) return await komi.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}give @user <value/valor>`, id)
				const checkValue = await gaming.getValue(user, nivel, 'xp')
				var theXpdonate = quotedMsg ? parseInt(args[0], 10) : (mentionedJidList.length !== 0 ? parseInt(args[1], 10) : parseInt(args[1], 10))
				if (isNaN(theXpdonate) || !isInt(theXpdonate) || Number(theXpdonate) > checkValue || theXpdonate < 1) return await komi.reply(from, mess.noxpalv(checkValue), id)
				var sortFd = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
				if (sortFd == null) return await komi.reply(from, mess.cmdfailed(), id)
				await gaming.addValue(user, Number(-theXpdonate), nivel, 'xp')
				await gaming.addValue(sortFd, Number(theXpdonate), nivel, 'xp')
				await komi.sendTextWithMentions(from, mess.xpdon(sortFd, theXpdonate))
				break
				
			case 'bang':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				var bangme = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : randomMember)
				await komi.sendStickerfromUrl(from, `https://steamuserimages-a.akamaihd.net/ugc/693902535301465982/17F72381587B6BE37BF2E36D159A75486CA097AA/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false`, { author: config.Sticker_Author, pack: config.Sticker_Pack, keepScale: true })
				await komi.sendTextWithMentions(from, mess.lolibang(user, bangme, whatWeapon), id)
				break
				
			case 'muteall':
				if (isOwner) {
					if (args.length == 0) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						isMuteAll = 1;await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						isMuteAll = 0;await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica2(), id)
				} else return await komi.reply(from, mess.sodono(), id)
				break
				
			case 'newprefix':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length == 0 || args[0].toLowerCase() == '-help') return await komi.reply(from, mess.noargs() + 'new prefix.', id)
					const newprefix = { [groupId]: `${args[0]}` }
					Object.keys(ctmprefix).forEach(async (i) => { for (let o = 0; o < Object.keys(ctmprefix).length; o++) { if (Object.keys(ctmprefix[o]) == groupId) { ctmprefix.splice(o, 1) } } })
					ctmprefix.push(newprefix);await fs.writeFileSync('./lib/config/Gerais/prefix.json', JSON.stringify(ctmprefix))
					await komi.reply(from, mess.newprefix(args), id)
				} else if (isGroupMsg) {
					await komi.reply(from, mess.soademiro(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'idioma':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args[0].toLowerCase() == 'en' && !functions[0].en.includes(groupId)) {
						functions[0].en.push(groupId);functions[0].es.splice(groupId, 1);functions[0].pt.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'es' && !functions[0].es.includes(groupId)) {
						functions[0].es.push(groupId);functions[0].en.splice(groupId, 1);functions[0].pt.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'pt' && !functions[0].pt.includes(groupId)) {
						functions[0].pt.push(groupId);functions[0].es.splice(groupId, 1);functions[0].en.splice(groupId, 1)
						await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
						await komi.reply(from, mess.enabled(), id)
					} else return await komi.reply(from, mess.usinglang(), id)
				} else if (isGroupMsg) {
					await komi.reply(from, mess.soademiro(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'noadms':;case 'noadmin':
				if (isGroupMsg) {
					const groupOwnerz = user === chat.groupMetadata.owner
					if (groupOwnerz || isOwner) {
						if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
						for (let noadms of groupAdmins) {
							if (noadms == groupOwnerz || ownerNumber.includes(noadms) || noadms == botNumber) {
								console.log(color('[VIP] - ', 'crimson'), noadms)
							} else { await komi.demoteParticipant(groupId, noadms) }
						}
						await komi.reply(from, mess.maked(), id)
					} else return await komi.reply(from, mess.gpowner(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'alladms':;case 'alladmin':
				if (isGroupMsg) {
					const groupOwneran = user === chat.groupMetadata.owner
					if (groupOwneran || isOwner) {
						if (!isBotGroupAdmins) return await komi.reply(from, mess.botademira(), id)
						for (let alladmin of groupMembersId) {
							if (groupAdmins.includes(alladmin)) {
								console.log(color('[JÁ ADM] - ', 'crimson'), alladmin)
							} else { await komi.promoteParticipant(groupId, alladmin) }
						}
						await komi.reply(from, mess.maked(), id)
					} else return await komi.reply(from, mess.gpowner(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
		
			case 'trending':;case 'twitter':;case 'trendings':;case 'trend':;case 'trends':
				var aFplaceOnEarth = args.length !== 0 ? args[0] : region == 'pt' ? 'brazil' : region == 'en' ? 'United%20States' : 'Argentina'
				const newsNow = await axios.get(`https://api-twitter-trends.herokuapp.com/trends?location=${aFplaceOnEarth}`)
				if (newsNow.data.status == false) return await komi.reply(from, mess.noresult(), id)
				var theTrend = `🌎 - ${newsNow.data.data.location} - 🌎\n\n`
				for (let i = 0; i < 10; i++) {
					var monkeyIdent = newsNow.data.data.trends[1].data[i].tweet_count == '' ? '+1K' : newsNow.data.data.trends[1].data[i].tweet_count
					theTrend += `\n${i + 1} → *#${newsNow.data.data.trends[1].data[i].name} - ${monkeyIdent} Tweets*\n`
				}
				await komi.reply(from, theTrend, id)
				break
				
			
			case 'market':
				if (args.length == 0) return await komi.reply(from, mess.reMerchant(), id) // Mude o MLB se desejar
				const placeToBuy = !arks.includes('|') ? 'MLB' : args[0];const vibProduct = !arks.includes('|') ? body.slice(7) : arg.split('|')[1]
				const getML = await axios.get(`https://api.mercadolibre.com/sites/${placeToBuy}/search?q=${encodeURIComponent(vibProduct)}&limit=1#json`)
				const isNewP = getML.data.results[0].condition == 'new' ? 'Sim' : 'Não'
				const temLoja = getML.data.results[0].shipping.store_pick_up == true ? 'Sim' : 'Não'
				await komi.sendFileFromUrl(from, `${getML.data.results[0].thumbnail}`, 'produto.jpg', mess.theStore(getML, isNewP, temLoja), id)
				break
				
			
			case 'jokenpo':
				const bigThree = Math.floor(Math.random() * 3) + 1;const jokenPedra = ['pedra', '✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', 'rock', 'piedra', '🪨'];const jokenLesb = ['tesoura', '✌️', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿', 'scissors', 'tijera', '✂️'];const jokenPaper = ['papel', '✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿', 'paper', '🤚', '🤚🏻', '🤚🏼', '🤚🏽', '🤚🏾', '🤚🏿']
				if (!jokenPedra.includes(args[0]) && !jokenPaper.includes(args[0]) && !jokenLesb.includes(args[0])) return await komi.reply(from, mess.noargs() + 'pedra [✊🏻], papel [✋🏿] ou tesoura [✌️]', id)
				const needPlay = jokenPedra.includes(args[0]) ? 1 : jokenPaper.includes(args[0]) ? 2 : jokenLesb.includes(args[0]) ? 3 : false
				const theMove = bigThree == 1 ? '✊🏻 - Pedra/Rock/Piedra' : bigThree == 2 ? '✋🏿 - Papel/Paper' : bigThree == 3 ? '✌️ - Tesoura/Tijera/Scissors' : 'Algo'
				if (needPlay == bigThree) {
					await komi.reply(from, mess.nowinjoken(theMove), id)
				} else if (needPlay == 2 && bigThree == 1 || needPlay == 3 && bigThree == 2 || needPlay == 1 && bigThree == 3) {
					await komi.reply(from, mess.winjoken(theMove, args), id)
				} else return await komi.reply(from, mess.losejoken(theMove, args), id)
				break
				
			case 'create':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				if (args.length == 0 || !arks.includes('|')) return await komi.reply(from, mess.newgp(), id)
				const peopleAdd = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList : user)
				await komi.createGroup(arg.split('|')[0], peopleAdd)
				await komi.reply(from, mess.maked(), id)
				break
				
			case 'views':
				if (!quotedMsg) return await komi.reply(from, mess.nomark(), id)
				if (!quotedMsgObj.fromMe) return await komi.reply(from, mess.mymess(), id)
				const whoInpo = await komi.getMessageReaders(quotedMsg.id)
				var eAK47 = '👀 - Views - 👀\n'
				if (whoInpo[0] == null) return komi.reply(from, mess.noviews(), id)
				for (let i = 0; i < whoInpo.length; i++) { var thefuckName = whoInpo[i].pushname;if(thefuckName == null) thefuckName = '??? - Top secret name - ???';eAK47 += `\n- ${thefuckName} - (wa.me/${whoInpo[i].id.replace('@c.us', '')})\n` }
				await komi.reply(from, eAK47, id)
				break
				
			case 'reload':
				if (!isOwner) return await komi.reply(from, mess.sodono(), id)
				await komi.reply(from, mess.wait(), id);await komi.refresh();await komi.reply(from, mess.refreshed(), id)
				break
				
			case 'type':
				if (isOwner) {
					if (args.length == 0) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						isTyping.push(groupId)
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						isTyping.splice(groupId, 1)
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica2(), id)
				} else return await komi.reply(from, mess.sodono(), id)
				break
				
			case 'darkmode':
				if (isOwner) {
					if (args.length == 0) return await komi.reply(from, mess.onoff(), id)
					if (args[0].toLowerCase() == 'on') {
						await komi.darkMode(true)
						await komi.reply(from, mess.enabled(), id)
					} else if (args[0].toLowerCase() == 'off') {
						await komi.darkMode(false)
						await komi.reply(from, mess.disabled(), id)
					} else return await komi.reply(from, mess.kldica2(), id)
				} else return await komi.reply(from, mess.sodono(), id)
				break
				
			case 'ctt':
				if (args.length == 0 || !arks.includes('|')) return await komi.reply(from, mess.noargs(), id)
				await komi.sendVCard(from, `BEGIN:VCARD\nVERSION:3.0\nFN;CHARSET=UTF-8:${arg.split('|')[1]}\nTEL;TYPE=CELL,VOICE:${arg.split('|')[0]}\nEND:VCARD`)
				break
				
			case 'gerador':
				await exec(`cd lib/scripts && bash config.sh dados`, async (error, stdout, stderr) => {
					if (error || stderr || stdout == null || stdout == '') {
						await komi.reply(from, mess.fail(), id);console.log(error, stderr)
					} else return await komi.sendFileFromUrl(from, 'https://thispersondoesnotexist.com/image', 'image.jpg', stdout, id)
				})
				break
				
			case 'movie':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Nome de Filme.', id)
				const movieInfo = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${config.API_TheMovieDB}&query=${encodeURIComponent(body.slice(7))}&language=${region}`)
				if (movieInfo.data.total_results == 0) return await komi.reply(from, mess.noresult(), id)
				const fotoFilme = movieInfo.data.results[0].backdrop_path == null ? errorImg : `https://image.tmdb.org/t/p/original${movieInfo.data.results[0].backdrop_path}`
				await komi.sendFileFromUrl(from, fotoFilme, 'filme.jpg', mess.movies(region, movieInfo), id)
				break
				
			case 'news':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Tema.', id)
				const theNews = await axios.get(`https://news.google.com/rss/search?q=${body.slice(6)}&hl=${region}`)
				await fs.writeFileSync('./lib/scripts/news.xml', theNews.data)
				await exec(`cd lib/scripts && bash config.sh news`, async (error, stdout, stderr) => {
					if (error || stderr || stdout == null || stdout == '') {
						await komi.reply(from, mess.fail(), id);console.log(error, stderr)
					} else return await komi.reply(from, `${stdout}`, id)
				})
				break
				
			case 'tweet':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Twitter @.', id)
				const twitterMsg = await axios.get(`https://decapi.me/twitter/latest/${args[0]}`)
				await komi.reply(from, `${args[0]} → "${twitterMsg.data}".`, id)
				break
				
			case 'number':
				if (args.length == 0 || isNaN(args[0]) || isNaN(args[1])) return await komi.reply(from, mess.noargs() + `Min-Number Max-Number.\n\nEx: ${prefix}Number 1 10`, id)
				const randomNumber = Math.floor(Math.random() * Number(args[1])) + Number(args[0])
				await komi.reply(from, `☘ - ${randomNumber} - ☘`, id)
				break
				
			case 'deezer':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'nome da música', id)
				try {
					const musicFind = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(body.slice(8))}`)
					if (musicFind.data.total == 0) return await komi.reply(from, mess.noresult(), id)
					const theMusicD = musicFind.data.data[0]
					await komi.sendFileFromUrl(from, theMusicD.album.cover, 'cover.jpg', mess.musicdzr(theMusicD), id)
					await komi.sendAudio(from, theMusicD.preview, id)
				} catch (error) {
					await komi.reply(from, mess.fail() + '\n\n' + `Use ${prefix}Play.`, id)
					console.log(color('[DEEZER]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'dark':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Dark/Deep-Web Website.', id)
				const darkNet = await axios.get(`https://darksearch.io/api/search?query=${encodeURIComponent(body.slice(6))}`)
				if (darkNet.data.total == 0) return await komi.reply(from, mess.noresult(), id)
				var darkSites = ''
				for (let i = 1; i < darkNet.data.per_page; i++) { darkSites += `\n${darkNet.data.data[i].title}\n\n${darkNet.data.data[i].link}\n-_-_-_-_-_-_-\n` }
				await komi.reply(from, `Sites: ${darkNet.data.total}\n\n${darkSites}`, id)
				break
				
			case 'drink':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Bebida/Drink.', id)
				const aSolitareDrink = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(body.slice(7))}`)
				if (aSolitareDrink.data.drinks == null) return await komi.reply(from, mess.noresult(), id)
				const garsonDK = aSolitareDrink.data.drinks[0];var aCock = '';var ingredient = 0;var qtdozig = 0
				for (let i = 1; i < 15; i++) {
					var funcDrink = eval(`garsonDK.strIngredient${i}`);var ingreDrink = eval(`garsonDK.strMeasure${i}`)
					if (!funcDrink == null || !funcDrink == '') { aCock += `Item ${ingredient + 1} = ${funcDrink} `;ingredient = ingredient + 1}
					if (!ingreDrink == null || !ingreDrink == '') { aCock += `- ${ingreDrink}\n\n`;qtdozig = qtdozig + 1 }
				}
				if (region == 'en') return await komi.sendFileFromUrl(from, garsonDK.strDrinkThumb, 'drink.jpg', `Drink: ${garsonDK.strDrink}\n\nAlcoholic? ${garsonDK.strAlcoholic == 'Alcoholic' ? 'Yes' : 'No'}\n\n${aCock}\n\nMaking: ${garsonDK.strInstructions}`, id)
				await translate(garsonDK.strInstructions, region).then(async (drink) => { await komi.sendFileFromUrl(from, garsonDK.strDrinkThumb, 'drink.jpg', mess.drinkcmd(garsonDK, aCock, drink), id) })
				break
				
			case 'meal':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Food/Comida.', id)
				const sanjiFood = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(body.slice(6))}`)
				if (sanjiFood.data.meals == null) return await komi.reply(from, mess.noresult(), id)
				const garsonFD = sanjiFood.data.meals[0];var cookTa = '';var fingredi = 0;var ingdefod = 0
				for (let i = 1; i < 15; i++) {
					var funcFood = eval(`garsonFD.strIngredient${i}`);var ingreFood = eval(`garsonFD.strMeasure${i}`)
					if (!funcFood == null || !funcFood == '') { cookTa += `Item ${fingredi + 1} = ${funcFood} `;fingredi = fingredi + 1 }
					if (!ingreFood == null || !ingreFood == '') { cookTa += `- ${ingreFood}\n\n`;ingdefod = ingdefod + 1 }
				}
				if (region == 'en') return await komi.sendFileFromUrl(from, garsonFD.strMealThumb, 'food.jpg', `Food: ${garsonFD.strMeal}\n\nTypical: ${garsonFD.strArea}\n\n${cookTa}\n\nCooking: ${garsonFD.strInstructions}`, id)
				await translate(garsonFD.strInstructions, region).then(async (food) => { await komi.sendFileFromUrl(from, garsonFD.strMealThumb, 'food.jpg', mess.mealcmd(garsonFD, cookTa, food), id) })
				break
				
			case 'mymsg':
				if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Recado.', id)
				const defineRec = { user: user, msg: `${body.slice(7)}` }
				Object.keys(custom).forEach(async (i) => { if (custom[i].user == user) { custom.splice(i, 1);await fs.writeFileSync('./lib/config/Gerais/custom.json', JSON.stringify(custom)) } })
				custom.push(defineRec)
				await fs.writeFileSync('./lib/config/Gerais/custom.json', JSON.stringify(custom))
				await komi.reply(from, mess.maked(), id)
				break
				
			case 'jail':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const jailPictr = isQuotedImage ? quotedMsg : message
						const getJailPict = await decryptMedia(jailPictr, uaOverride)
						var theJailPictu = await upload(getJailPict, false)
					} else { var sendJailPictre = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (sendJailPictre == null || typeof sendJailPictre === 'object') sendJailPictre = errorImg
					await canvacord.Canvas.jail(sendJailPictre, true).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `jail.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[JAIL]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'beijo':
				try {
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							const kissPicG = isQuotedImage ? quotedMsg : message
							const getKisuPict = await decryptMedia(kissPicG, uaOverride)
							var theKisuPict = await upload(getKisuPict, false)
							var theKisuPict2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user))
						} else {
							if (mentionedJidList.length == 2) {
								var theKisuPict = await komi.getProfilePicFromServer(mentionedJidList[0])
								var theKisuPict2 = await komi.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theKisuPict = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)
								var theKisuPict2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : await komi.getProfilePicFromServer(user)
							}
							if (theKisuPict == null || typeof theKisuPict === 'object') theKisuPict = errorImg;if (theKisuPict2 == null || typeof theKisuPict2 === 'object') theKisuPict2 = errorImg
						}
						await canvacord.Canvas.kiss(theKisuPict, theKisuPict2).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `kiss.png`, '', id) })
					} else return await komi.reply(from, mess.semmarcar() + '\n2x.', id)
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[BEIJO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'bed':
				try {
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							const BadOPicG = isQuotedImage ? quotedMsg : message
							const getBEDPict = await decryptMedia(BadOPicG, uaOverride)
							var theBedPict = await upload(getBEDPict, false)
							var theBedPict2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user))
						} else {
							if (mentionedJidList.length == 2) {
								var theBedPict = await komi.getProfilePicFromServer(mentionedJidList[0])
								var theBedPict2 = await komi.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theBedPict = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)
								var theBedPict2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : await komi.getProfilePicFromServer(user)
							}
							if (theBedPict == null || typeof theBedPict === 'object') theBedPict = errorImg;if (theBedPict2 == null || typeof theBedPict2 === 'object') theBedPict2 = errorImg
						}
						await canvacord.Canvas.bed(theBedPict, theBedPict2).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `bed.png`, '', id) })
					} else return await komi.reply(from, mess.semmarcar() + '\n2x.', id)
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[BED]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'clyde':
				try {
					if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Mensagem.', id)
					await canvacord.Canvas.clyde(body.slice(7)).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `clyde.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[CLYDE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'spank':
				try {
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							const spankGet = isQuotedImage ? quotedMsg : message
							const getSpankP = await decryptMedia(spankGet, uaOverride)
							var theSpankPic = await upload(getSpankP, false)
							var theSpankPic2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user))
						} else {
							if (mentionedJidList.length == 2) {
								var theSpankPic = await komi.getProfilePicFromServer(mentionedJidList[0])
								var theSpankPic2 = await komi.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theSpankPic = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)
								var theSpankPic2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : await komi.getProfilePicFromServer(user)
							}
							if (theSpankPic == null || typeof theSpankPic === 'object') theSpankPic = errorImg;if (theSpankPic2 == null || typeof theSpankPic2 === 'object') theSpankPic2 = errorImg
						}
						await canvacord.Canvas.spank(theSpankPic, theSpankPic2).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `spank.png`, '', id) })
					} else return await komi.reply(from, mess.semmarcar() + '\n2x.', id)
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[SPANK]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'batslap':
				try {
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							const batSlepGet = isQuotedImage ? quotedMsg : message
							const getBatSlap = await decryptMedia(batSlepGet, uaOverride)
							var theBatSlap = await upload(getBatSlap, false)
							var theBatSlap2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user))
						} else {
							if (mentionedJidList.length == 2) {
								var theBatSlap = await komi.getProfilePicFromServer(mentionedJidList[0])
								var theBatSlap2 = await komi.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var theBatSlap = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)
								var theBatSlap2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : await komi.getProfilePicFromServer(user)
							}
							if (theBatSlap == null || typeof theBatSlap === 'object') theBatSlap = errorImg;if (theBatSlap2 == null || typeof theBatSlap2 === 'object') theBatSlap2 = errorImg
						}
						await canvacord.Canvas.slap(theBatSlap, theBatSlap2).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `spank.png`, '', id) })
					} else return await komi.reply(from, mess.semmarcar() + '\n2x.', id)
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[BEIJO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'distract':
				try {
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							const boyfriendGet = isQuotedImage ? quotedMsg : message
							const getboyfriend = await decryptMedia(boyfriendGet, uaOverride)
							var theboyfriend = await upload(getboyfriend, false)
							var theboyfriend2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user))
							var theboyfriend3 = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[1]) : await komi.getProfilePicFromServer(user)
						} else {
							if (mentionedJidList.length == 3) {
								var theboyfriend = await komi.getProfilePicFromServer(mentionedJidList[0])
								var theboyfriend2 = await komi.getProfilePicFromServer(mentionedJidList[1])
								var theboyfriend3 = await komi.getProfilePicFromServer(mentionedJidList[2])
							} else {
								var theboyfriend = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)
								var theboyfriend2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : await komi.getProfilePicFromServer(user)
								var theboyfriend3 = false
							}
							if (theboyfriend == null || typeof theboyfriend === 'object') theboyfriend = errorImg;if (theboyfriend2 == null || typeof theboyfriend2 === 'object') theboyfriend2 = errorImg;if (theboyfriend3 == null || typeof theboyfriend3 === 'object') theboyfriend3 = errorImg;
						}
						await canvacord.Canvas.distracted(theboyfriend, theboyfriend2, theboyfriend3).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `distract.png`, '', id) })
					} else return await komi.reply(from, mess.semmarcar() + '\n3x.', id)
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[DISTRACT]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'joke':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const jokePict = isQuotedImage ? quotedMsg : message
						const jokePicImg = await decryptMedia(jokePict, uaOverride)
						var jokErPictF = await upload(jokePicImg, false)
					} else { var jokErPictF = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (jokErPictF == null || typeof jokErPictF === 'object') jokErPictF = errorImg
					await canvacord.Canvas.jokeOverHead(jokErPictF).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `joke.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[JOKE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'mind':
				try {
					if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Mensagem.', id)
					await canvacord.Canvas.changemymind(body.slice(6)).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `mind.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[MIND]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'ohno':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				try {
					if (args.length == 0) return await komi.reply(from, mess.noargs() + 'Mensagem.', id)
					await canvacord.Canvas.ohno(body.slice(6)).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `ohno.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[OHNO]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'baby':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const nidabPictr = isQuotedImage ? quotedMsg : message
						const getnidabPict = await decryptMedia(nidabPictr, uaOverride)
						var thenidabPictu = await upload(getnidabPict, false)
					} else { var thenidabPictu = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (thenidabPictu == null || typeof thenidabPictu === 'object') thenidabPictu = errorImg
					await canvacord.Canvas.affect(thenidabPictu).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `baby.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[BABY]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'fuse':
				try {
					if (mentionedJidList.length >= 1 || quotedMsg) {
						if (isImage || isQuotedImage) {
							const FundiPicG = isQuotedImage ? quotedMsg : message
							const getFundPict = await decryptMedia(FundiPicG, uaOverride)
							var fundPict = await upload(getFundPict, false)
							var fundPict2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user))
						} else {
							if (mentionedJidList.length == 2) {
								var fundPict = await komi.getProfilePicFromServer(mentionedJidList[0])
								var fundPict2 = await komi.getProfilePicFromServer(mentionedJidList[1])
							} else {
								var fundPict = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)
								var fundPict2 = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : await komi.getProfilePicFromServer(user)
							}
							if (fundPict == null || typeof fundPict === 'object') fundPict = errorImg;if (fundPict2 == null || typeof fundPict2 === 'object') fundPict2 = errorImg
						}
						await canvacord.Canvas.fuse(fundPict, fundPict2).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `fuse.png`, '', id) })
					} else return await komi.reply(from, mess.semmarcar() + '\n2x.', id)
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[FUSE]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'beauty':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const beautPictr = isQuotedImage ? quotedMsg : message
						const getbeautPict = await decryptMedia(beautPictr, uaOverride)
						var thebeautPictu = await upload(getbeautPict, false)
					} else { var thebeautPictu = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (thebeautPictu == null || typeof thebeautPictu === 'object') thebeautPictu = errorImg
					await canvacord.Canvas.beautiful(thebeautPictu).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `beautiful.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[BEAUTY]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'pixel':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const pixelPictr = isQuotedImage ? quotedMsg : message
						const getPixelPict = await decryptMedia(pixelPictr, uaOverride)
						var thePixelPictu = await upload(getPixelPict, false)
					} else { var thePixelPictu = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (thePixelPictu == null || typeof thePixelPictu === 'object') thePixelPictu = errorImg
					await canvacord.Canvas.pixelate(thePixelPictu).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `pixelate.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[PIXEL]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'reward':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const wantedPict = isQuotedImage ? quotedMsg : message
						const getWantedPic = await decryptMedia(wantedPict, uaOverride)
						var thePicWanted = await upload(getWantedPic, false)
					} else { var thePicWanted = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (thePicWanted == null || typeof thePicWanted === 'object') thePicWanted = errorImg
					await canvacord.Canvas.wanted(thePicWanted).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `reward.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[REWARD]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'sharp':
				try {
					await komi.reply(from, mess.wait(), id);var sharplvl = 1
					if (isImage || isQuotedImage) {
						const aNormalImg = isQuotedImage ? quotedMsg : message
						const downNmrImg = await decryptMedia(aNormalImg, uaOverride)
						var theSharpedImg = await upload(downNmrImg, false)
					} else { var theSharpedImg = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theSharpedImg == null || typeof theSharpedImg === 'object') theSharpedImg = errorImg;sharplvl = mentionedJidList.length !== 0 ? args[1] : args.length >= 1 && !isNaN(args[0]) ? args[0] : 1
					await canvacord.Canvas.sharpen(theSharpedImg).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `sharp.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[SHARP]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'burn':
				try {
					await komi.reply(from, mess.wait(), id);var burnlvl = 1
					if (isImage || isQuotedImage) {
						const afuckImg = isQuotedImage ? quotedMsg : message
						const whoisImage = await decryptMedia(afuckImg, uaOverride)
						var theBurnFire = await upload(whoisImage, false)
					} else { var theBurnFire = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theBurnFire == null || typeof theBurnFire === 'object') theBurnFire = errorImg;burnlvl = mentionedJidList.length !== 0 ? args[1] : args.length >= 1 && !isNaN(args[0]) ? args[0] : 1
					await canvacord.Canvas.burn(theBurnFire, Number(burnlvl)).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `burn.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[BURN]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'shold':
				try {
					await komi.reply(from, mess.wait(), id);var thrqtd = 100
					if (isImage || isQuotedImage) {
						const thrwtfimg = isQuotedImage ? quotedMsg : message
						const thrsimg = await decryptMedia(thrwtfimg, uaOverride)
						var theThreImg = await upload(thrsimg, false)
					} else { var theThreImg = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theThreImg == null || typeof theThreImg === 'object') theThreImg = errorImg;thrqtd = mentionedJidList.length !== 0 ? Number(args[1]) + 100 : args.length >= 1 && !isNaN(args[0]) ? Number(args[0]) + 100 : 100
					await canvacord.Canvas.threshold(theThreImg, Number(thrqtd)).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `threshold.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[SHOLD]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'opnion':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const godexist = isQuotedImage ? quotedMsg : message
						const ordonteit = await decryptMedia(ordontext, uaOverride)
						var theLGBTopn = await upload(ordonteit, false)
					} else { var theLGBTopn = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (theLGBTopn == null || typeof theLGBTopn === 'object') theLGBTopn = errorImg
					var opnionqs = body.slice(8).replace(mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' '), '')
					await canvacord.Canvas.opinion(theLGBTopn, opnionqs).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `opnion.png`, '', id) })
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[OPNION]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'upload':
				if (args.length !== 2) return await komi.reply(from, mess.filesend(), id)
				if (isOwner) { await komi.sendFile(from, args[0], args[1], '', id).catch(async (err) => { console.log(err);await komi.reply(from, mess.filexist(args), id) }) } else return komi.reply(from, mess.sodono(), id)
				break
			
			case 'surprise':
				const surpmother = await fs.readFileSync('./lib/config/Utilidades/sounds.txt').toString().split('\n')
				const theSurprise = surpmother[Math.floor(Math.random() * surpmother.length)]
				await komi.sendFileFromUrl(from, `https://www.myinstants.com/media/sounds/${theSurprise}`, 'audio.mp3', '', null, null, null, true, null, null).catch(async(err) => { console.log(err);await komi.sendPtt(from, 'https://www.myinstants.com/media/sounds/soviet-anthem-but-its-sung-by-a-loli-audiotrimmer.mp3') })
				break
				
			case 'casal':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (args.length == 0 || isNaN(args[0])) return await komi.reply(from, mess.casais(), id)
				var casaltop = `-----[ *❤️ TOP ${args[0]} CASAIS ❤️* ]----\n\n`
				for (let i = 0; i < Number(args[0]); i++) {
					var loveExist = groupMembers[Math.floor(Math.random() * groupMembers.length)];var loveExist2 = groupMembers[Math.floor(Math.random() * groupMembers.length)]
					var getLoveNm = await komi.getContact(loveExist.id);var getLoveNm2 = await komi.getContact(loveExist2.id)
					var theLoveMachine = getLoveNm.pushname == null ? 'wa.me/' + loveExist.id.replace('@c.us', '') : getLoveNm.pushname
					var theLoveMachine2 = getLoveNm.pushname == null ? 'wa.me/' + loveExist2.id.replace('@c.us', '') : getLoveNm2.pushname
					casaltop += `${i + 1} - (${theLoveMachine}) + (${theLoveMachine2})\n\n`
				}
				await komi.reply(from, casaltop, id)
				break
				
			case 'top':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				if (args.length <= 1 || !arks.includes('|') || isNaN(arg.split('|')[1])) return await komi.reply(from, mess.noargs() + 'TOP | Max. Users' + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
				var umtoprps = `-----[ *# TOP ${arg.split('|')[1]} ${arg.split('|')[0]} #* ]----\n\n`
				for (let i = 0; i < Number(arg.split('|')[1]); i++) {
					var topSlaoq = groupMembers[Math.floor(Math.random() * groupMembers.length)]
					var topHokuto = await komi.getContact(topSlaoq.id)
					var topOfWorld = topHokuto.pushname == null ? 'wa.me/' + topSlaoq.id.replace('@c.us', '') : topHokuto.pushname
					umtoprps += `${i + 1} - ${topOfWorld}\n\n`
				}
				await komi.reply(from, umtoprps, id)
				break
				
			case 'custom':
				if (args.length <= 1 || !arks.includes('|')) return await komi.reply(from, mess.noargs() + 'CMD | MSG' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);const cmdNamedW = removeAccents(arg.split('|')[0].replace(' ', '').toLowerCase());var needStopPls = 0
				for (let i = 0; i < cmds.length; i++) { if (Object.keys(cmds[i]) == cmdNamedW) { await komi.reply(from, mess.cmdExist(), id);needStopPls = 1;break } }
				if (needStopPls == 1) return // Nada a ser inserido aqui
				const newcmd = { [cmdNamedW]: arg.split('|')[1] }
				cmds.push(newcmd);await fs.writeFileSync('./lib/config/Gerais/cmds.json', JSON.stringify(cmds))
				await komi.reply(from, mess.cmdAdded(arg), id)
				break
				
			case 'run':
				if (args.length == 0) return await komi.reply(from, mess.onlyccmds(), id);var realywantstop = 0
				for (let o = 0; o < cmds.length; o++) { if (Object.keys(cmds[o]) == body.slice(5).replace(' ', '')) { Object.keys(cmds[o]).forEach(async (i) => { await komi.reply(from, cmds[o][i], id) });realywantstop = 1;break } }
				if (realywantstop == 0) return await komi.reply(from, mess.cmdnotfound(body), id)
				break
				
			case 'cmds':
				var customCMDS = 'Custom CMDS\n'
				for (let i = 0; i < cmds.length; i++) { customCMDS += `\n➸ ${Object.keys(cmds[i])}` }
				await komi.reply(from, customCMDS, id)
				break
				
			case 'greet':
				if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
					if (args.length <= 1 || !arks.includes('|') || args[0].toLowerCase() == '-help') return await komi.reply(from, mess.customWlc() + '\n\n' + mess.argsbar() + 'use 1 "|".', id)
					const onlyNew = arg.split('|')[1].replace(' ', '') == 'on' ? 1 : 0
					const nwlkme = { [groupId]: `${arg.split('|')[0]}`, onlyThis: onlyNew }
					Object.keys(hail).forEach(async (i) => { for (let o = 0; o < Object.keys(hail).length; o++) { if (Object.keys(hail[o]) == groupId) { hail.splice(o, 1) } } })
					hail.push(nwlkme);await fs.writeFileSync('./lib/config/Gerais/greetings.json', JSON.stringify(hail))
					await komi.reply(from, mess.enabled(), id)
				} else if (isGroupMsg) {
					await komi.reply(from, mess.soademiro(), id)
				} else return await komi.reply(from, mess.sogrupo(), id)
				break
				
			case 'tictac':
				if (args.length == 0 || args[0].toLowerCase() == '-help') return await komi.reply(from, mess.tictactoe(), id);const jogadaPlayer = args[0].toLowerCase()
				const theplayer2 = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
				if (theplayer2 !== null) isValidGame = 1
				const resetGameNew = () => { thePlayerGame = 0;thePlayerGame2 = 0;thePlayerGameOld = 0;thePlayerGameOld2 = 0;xjogadas = [];ojogadas = [];waitJogo = 0;timesPlayed = 0;tictacplays = ["a1", "a2", "a3", "b1", "b2", "b3", "c1", "c2", "c3"];tttboard = { a1: 'A1', a2: 'A2', a3: 'A3', b1: 'B1', b2: 'B2', b3: 'B3', c1: 'C1', c2: 'C2', c3: 'C3' };finalAwnser = 0;isValidGame = 0 }
				const verifyVict = () => { let twoPlayer = ['xjogadas', 'ojogadas'];for (let i = 0; i < twoPlayer.length; i++) { if (eval(`${twoPlayer[i]}` + `.includes('a1')`) && eval(`${twoPlayer[i]}` + `.includes('a2')`) && eval(`${twoPlayer[i]}` + `.includes('a3')`) || eval(`${twoPlayer[i]}` + `.includes('b1')`) && eval(`${twoPlayer[i]}` + `.includes('b2')`) && eval(`${twoPlayer[i]}` + `.includes('b3')`) || eval(`${twoPlayer[i]}` + `.includes('c1')`) && eval(`${twoPlayer[i]}` + `.includes('c2')`) && eval(`${twoPlayer[i]}` + `.includes('c3')`) || eval(`${twoPlayer[i]}` + `.includes('a1')`) && eval(`${twoPlayer[i]}` + `.includes('b1')`) && eval(`${twoPlayer[i]}` + `.includes('c1')`) || eval(`${twoPlayer[i]}` + `.includes('b1')`) && eval(`${twoPlayer[i]}` + `.includes('b2')`) && eval(`${twoPlayer[i]}` + `.includes('b3')`) || eval(`${twoPlayer[i]}` + `.includes('a1')`) && eval(`${twoPlayer[i]}` + `.includes('b2')`) && eval(`${twoPlayer[i]}` + `.includes('c3')`) || eval(`${twoPlayer[i]}` + `.includes('a3')`) && eval(`${twoPlayer[i]}` + `.includes('b3')`) && eval(`${twoPlayer[i]}` + `.includes('c3')`) || eval(`${twoPlayer[i]}` + `.includes('a3')`) && eval(`${twoPlayer[i]}` + `.includes('b2')`) && eval(`${twoPlayer[i]}` + `.includes('c1')`)) { if ([i] == 0) { finalAwnser = 1 };if ([i] == 1) { finalAwnser = 2 } } };if (finalAwnser == 0 && tttboard.a1 !== 'A1' && tttboard.a2 !== 'A2' && tttboard.a3 !== 'A3' && tttboard.b1 !== 'B1' && tttboard.b2 !== 'B2' && tttboard.b3 !== 'B3' && tttboard.c1 !== 'C1' && tttboard.c2 !== 'C2' && tttboard.c3 !== 'C3') { finalAwnser = 3 };return finalAwnser }
				if (user == thePlayerGameOld && jogadaPlayer == '-cancel' || user == thePlayerGameOld2 && jogadaPlayer == '-cancel') { await komi.reply(from, mess.cancelgame(), id);await resetGameNew();return }
				if (thePlayerGame == 0 && waitJogo == 0 && isValidGame == 1 || user == thePlayerGame && waitJogo == 0 && isValidGame == 1 || user == thePlayerGame2 && waitJogo == 0 && isValidGame == 1) {
					if (!tictacplays.includes(jogadaPlayer)) return await komi.reply(from, mess.tictactoe(), id);waitJogo = 1
					timesPlayed == 0 ? thePlayerGame = user : thePlayerGame = thePlayerGameOld
					timesPlayed == 0 ? thePlayerGame2 = theplayer2 : thePlayerGame2 = thePlayerGameOld2
					thePlayerGameOld = thePlayerGame;thePlayerGameOld2 = thePlayerGame2
					if (user == thePlayerGameOld) { var spliceindex = xjogadas.push(jogadaPlayer);eval(`tttboard.${jogadaPlayer} = '❌'`);var spliceindex2 = tictacplays.indexOf(jogadaPlayer);if (spliceindex2 !== -1) { tictacplays.splice(spliceindex2, 1) } };if (user == thePlayerGameOld2) { var komisplice = ojogadas.push(jogadaPlayer);eval(`tttboard.${jogadaPlayer} = '⭕'`);var komisplice2 = tictacplays.indexOf(jogadaPlayer);if (komisplice2 !== -1) { tictacplays.splice(komisplice2, 1) } };await komi.reply(from, `${tttboard.a1}		|		${tttboard.a2}		|		${tttboard.a3}\n\n${tttboard.b1}		|		${tttboard.b2}		|		${tttboard.b3}\n\n${tttboard.c1}		|		${tttboard.c2}		|		${tttboard.c3}`, id)
					var theVeredict = await verifyVict(xjogadas, ojogadas)
					if (theVeredict == 1) { await komi.sendTextWithMentions(from, mess.playerWin(thePlayerGameOld));return await resetGameNew() }
					if (theVeredict == 2) { await komi.sendTextWithMentions(from, mess.playerWin(thePlayerGameOld2));return await resetGameNew() }
					if (theVeredict == 3) { await komi.sendText(from, mess.draw());return await resetGameNew() }
					if (thePlayerGameOld == user) { thePlayerGame2 = thePlayerGameOld2;thePlayerGame = 1 };if (thePlayerGameOld2 == user) { thePlayerGame = thePlayerGameOld;thePlayerGame2 = 1 };timesPlayed = 1;waitJogo = 0
				} else if (thePlayerGameOld !== 0) {
					await komi.sendTextWithMentions(from, mess.someoneplay(thePlayerGameOld.replace('@c.us', ''), thePlayerGameOld2.replace('@c.us', '')), id)
				} else return await komi.reply(from, mess.tictactoe(), id)
				break
				
			case 'detect':
				if (isMedia && isAudio || isQuotedAudio || isPtt || isQuotedPtt) {
					try {
						await komi.reply(from, mess.wait() + '\n\n' + mess.useLimit(), id)
						const theCryptAudio = isQuotedAudio || isQuotedPtt ? quotedMsg : message
						const audioUncrypt = await decryptMedia(theCryptAudio, uaOverride)
						await fs.writeFile(`./lib/media/audio/detect-${user.replace('@c.us', '')}${lvpc}.mp3`, audioUncrypt, async (err) => {
							if (err) return console.error(err)
							await acr.identify(await fs.readFileSync(`./lib/media/audio/detect-${user.replace('@c.us', '')}${lvpc}.mp3`)).then(async (resp) => {
								if (resp.status.code == 1001) return await komi.reply(from, mess.noresult(), id)
								if (resp.status.code == 3003 || resp.status.code == 3015) return await komi.reply(from, mess.invalidKey(), id)
								if (resp.status.code == 3000) return await komi.reply(from, mess.serverError(), id)
								let artistas = [];for (let artista of resp.metadata.music[0].artists) { artistas.push(artista.name) }
								await komi.reply(from, mess.detectmsc(resp, artistas), id)
							})
						})
					} catch (error) {
						await komi.reply(from, mess.fail(), id)
						console.log(color('[DETECT]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					}
				} else return await komi.reply(from, mess.onlyaudio(), id)
				break
				
			case 'agiotar':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				if (!isxp) return await komi.reply(from, mess.needxpon(), id)
				if (args.length <= 1) return await komi.reply(from, mess.semmarcar() + `\n\nEx: ${prefix}Agiotar @user <value/valor>`, id)
				const checkAgiota = await gaming.getValue(user, nivel, 'xp')
				var theAgiota = quotedMsg ? parseInt(args[0], 10) : (mentionedJidList.length !== 0 ? parseInt(args[1], 10) : parseInt(args[1], 10))
				var timeAgiota = quotedMsg ? args[1] : (mentionedJidList.length !== 0 ? args[2] : args[2])
				if (isNaN(theAgiota) || !isInt(theAgiota) || Number(theAgiota) > checkAgiota || theAgiota < 100 || isNaN(timeAgiota) || timeAgiota < 5) return await komi.reply(from, mess.maxAgiota(checkAgiota), id)
				var alvoAgiota = quotedMsg ? quotedMsgObj.sender.id : (mentionedJidList.length !== 0 ? mentionedJidList[0] : null)
				if (alvoAgiota == null) return await komi.reply(from, mess.cmdfailed(), id)
				await gaming.addValue(user, Number(-theAgiota), nivel, 'xp');await gaming.addValue(alvoAgiota, Number(theAgiota), nivel, 'xp')
				await komi.sendTextWithMentions(from, mess.moneyagi(theAgiota, alvoAgiota, timeAgiota))
				await sleep(Number(timeAgiota * 60000));await komi.sendTextWithMentions(from, mess.backmoney(theAgiota, user, alvoAgiota))
				await gaming.addValue(alvoAgiota, Number(-theAgiota), nivel, 'xp');await gaming.addValue(user, Number(theAgiota), nivel, 'xp')
				break
				
			case 'sepia':
				try {
					await komi.reply(from, mess.wait(), id)
					if (isImage || isQuotedImage) {
						const crptimg = isQuotedImage ? quotedMsg : message
						const imgsepia = await decryptMedia(crptimg, uaOverride)
						var sepiaUpl = await upload(imgsepia, false)
					} else { var sepiaUpl = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)) }
					if (sepiaUpl == null || typeof sepiaUpl === 'object') sepiaUpl = errorImg
					await canvacord.Canvas.invert(sepiaUpl).then(async (buffer) => { await komi.sendFile(from, `data:image/png;base64,${buffer.toString('base64')}`, `sepia.png`, '', id) })
				} catch (error) {
					console.log(color('[SEPIA]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
					await komi.reply(from, mess.fail(), id)
				}
				break
				
			case 'medal':
				try {
					const memer = canvas.createCanvas(760, 481);const context = memer.getContext('2d');const background = await canvas.loadImage('https://i.ibb.co/XbLtr51/obama.jpg')
					context.drawImage(background, 5, 5, memer.width-10, memer.height-10);context.lineWidth = 10;context.strokeRect(0, 0, memer.width, memer.height);
					if (isImage || isQuotedImage) {
						const kissPicG = isQuotedImage ? quotedMsg : message
						const getKisuPict = await decryptMedia(kissPicG, uaOverride)
						var personOne = await upload(getKisuPict, false)
						var personTwo = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user))
					} else {
						if (mentionedJidList.length == 2) {
							var personOne = await komi.getProfilePicFromServer(mentionedJidList[0])
							var personTwo = await komi.getProfilePicFromServer(mentionedJidList[1])
						} else {
							var personOne = mentionedJidList.length !== 0 ? await komi.getProfilePicFromServer(mentionedJidList[0]) : await komi.getProfilePicFromServer(user)
							var personTwo = quotedMsg ? await komi.getProfilePicFromServer(quotedMsgObj.sender.id) : await komi.getProfilePicFromServer(user)
						}
					}
					var avatar1 = await canvas.loadImage(personOne);context.drawImage(avatar1, 160, 96, 200, 200)
					var avatar2 = await canvas.loadImage(personTwo);context.drawImage(avatar2, 380, 10, 200, 200)
					await komi.sendFile(from, `data:image/png;base64,${memer.toBuffer().toString('base64')}`, `kiss.png`, '', id)
				} catch (error) {
					await komi.reply(from, mess.fail(), id)
					console.log(color('[MEDAL]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'guild':;case 'guilda':
				const waitToChange = await gaming.getLimit(user, guildlimit)
				if (gaming.isLimit(waitToChange) == 1) return await komi.reply(from, mess.waitNewGuild(), id)
				if (args.length !== 0 && args[0].toLowerCase() == '-thieves' || args.length !== 0 && args[0].toLowerCase() == '-companions') {
					if (functions[0].thieves.includes(user) && args[0].toLowerCase() == '-thieves' || functions[0].companions.includes(user) && args[0].toLowerCase() == '-companions') return await komi.reply(from, mess.onGuild(), id)
					if (functions[0].thieves.includes(user) || functions[0].companions.includes(user)) { await komi.reply(from, mess.changeGuild(), id);functions[0].companions.splice(user, 1);functions[0].thieves.splice(user, 1) }
					if (args[0].toLowerCase() == '-thieves') { functions[0].thieves.push(user) } else if (args[0].toLowerCase() == '-companions') { functions[0].companions.push(user) }
					await fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions))
					await komi.reply(from, mess.newGuild(), id)
					if (noLimits == 0) await gaming.addLimit(user, guildlimit, './lib/config/Gerais/limit.json')
				} else return await komi.reply(from, mess.helpGuild(), id)
				break
				
			case 'spoiler':
				if (!isPremium) return await komi.reply(from,'comando vip, fale com o dono atraves do wa.me/559889110607',id)
				await komi.reply(from, '⚠️ [Alerta de Spoiler] ⚠️\n\nAnime: [Digite o nome do anime] ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n\n\n\n[Você pode colocar seu spoiler aqui.]', id)
				break
				
			case 'thieves':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				let claladrao = '----- [ *GUILDA THIEVES* ] -----\n\n'
				try {
					for (let i = 0; i < functions[0].thieves.length; i++) {
						const identladrao = await komi.getContact(functions[0].thieves[i])
						var getLadrao = identladrao.pushname == null ? 'wa.me/' + functions[0].thieves[i].replace('@c.us', '') : identladrao.pushname + ` - [wa.me/${functions[0].thieves[i].replace('@c.us', '')}]`
						claladrao += `${i + 1} → *${getLadrao}*\n\n`
					}
					await komi.sendText(from, claladrao)
				} catch (error) { 
					await komi.reply(from, mess.fail(), id)
					console.log(color('[THIEVES]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'companions':
				if (!isGroupMsg) return await komi.reply(from, mess.sogrupo(), id)
				let clacompnos = '----- [ *GUILDA COMPANIONS* ] -----\n\n'
				try {
					for (let i = 0; i < functions[0].companions.length; i++) {
						const aGoodMan = await komi.getContact(functions[0].companions[i])
						var butNotReal = aGoodMan.pushname == null ? 'wa.me/' + functions[0].companions[i].replace('@c.us', '') : aGoodMan.pushname + ` - [wa.me/${functions[0].companions[i].replace('@c.us', '')}]`
						clacompnos += `${i + 1} → *${butNotReal}*\n\n`
					}
					await komi.sendText(from, clacompnos)
				} catch (error) { 
					await komi.reply(from, mess.fail(), id)
					console.log(color('[COMPANIONS]', 'crimson'), color(`→ Obtive erros no comando ${prefix}${command} → ${error.message} - Você pode ignorar.`, 'gold'))
				}
				break
				
			case 'ddd':
				if (!region == 'pt') return await komi.reply(from, 'Brasil somente!', id)
				if (args.length == 0 || isNaN(args[0])) return await komi.reply(from, `Você esqueceu de inserir o DDD.`, id)
				const ddds = await axios.get(`https://brasilapi.com.br/api/ddd/v1/${args[0]}`)
				if (ddds.data.type == 'ddd_error') return await komi.reply(from, ddds.data.message, id)
				var dddlist = `Lista de Cidades de ${ddds.data.state} com este DDD >\n\n`
				for (let i = 0; i < ddds.data.cities.length; i++) { dddlist += `${i + 1} → *${ddds.data.cities[i]}*\n\n` }
				await komi.reply(from, dddlist, id)
				break

                default:
				
				break
			// Desativa a linha "fantasma" no meu bloco de notas
		}
	} catch (err) {
		await komi.simulateTyping(from, true);await komi.reply(from, mess.fail(), id)
		//await komi.sendText(ownerNumber[0], mess.wpprpt(command, err))
		console.log(color('[Falhou geral aki]', 'red'), err)
	}
}

				