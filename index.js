const { create, Client } = require('@open-wa/wa-automate')
const fs = require('fs-extra')
const kconfig = require('./kumi')
const { color, sleep, options } = require('./lib/functions')
const config = require('./lib/config/Gerais/config.json')
const canvas = require('discord-canvas')
const { mylang } = require('./lib/lang')
const axios = require('axios')
const komivs = require('./package.json')
var welcOn = 0;var abayo = 0
const os = require('os')
const Pokemon = require('pokemon.js')
const moment = require('moment-timezone')
//const { misc } = require('./lib/index.js')

// Quantidade máxima de Backups do Level.json e MsgCount.json
const maxBackups = Math.floor(Math.random() * 3) + 1

// Apaga a pasta de cache do Chrome caso exista
if (fs.existsSync('./logs/Chrome')) { fs.rmdirSync('./logs/Chrome', { recursive: true }) }

// Verifica por mudanças e se encontrado, recarrega o arquivo
const watchFile = (file) => { fs.watchFile(file, async () => { return new Promise((resolve, reject) => { try { console.log(color('[EDIÇÃO]', 'crimson'), color(`Uuuu! Melhorias em tempo real! Irei usar agora mesmo, estou reiniciando!`, 'yellow'));delete require.cache[require.resolve(file)];resolve();console.log(color('[EDIÇÃO]', 'lime'), color(`Reiniciei com sucesso! Testa, Testa!`, 'yellow')) } catch (error) { reject(error) } }) }) }

// Cria um cliente de inicialização da BOT
const start = async (komi = new Client()) => {
	const getversion = await axios.get('https://github.com/tionescau10k/Komi_bot/blob/main/package.json')
	if (komivs.version !== getversion.data.version) { console.log(color('\n[UPDATE]', 'crimson'), color(`Uma nova versão da Komi foi lançada [${getversion.data.version}], atualize para obter melhorias e correções! → ${komivs.homepage}`, 'gold')) }
	console.log(color('\n[SUPORTE]', 'magenta'), color(`I LOVE YOU NESCAU | ${komivs.bugs.url}\n`, 'lime'), color(`\n[Komi ${komivs.version} - BETA]`, 'magenta'), color('Estamos prontos para começar mestre!\n', 'lime'))
	
	// Auto Recarregamento da Config.js sem reiniciar, para casos de edições em tempo real, use com cautela e ative a require la em baixo se usar
	//await watchFile('./config.js')
	
	// Backup dos arquivos toda vez que religar a BOT
	const whotobackup = ['level.json', 'custom.json', 'greetings.json', 'cmds.json', 'functions.json']
	for (let i = 0; i < whotobackup.length; i++) {
		var fileReadBk = JSON.parse(fs.readFileSync('./lib/config/Gerais/' + whotobackup[i]))
		await fs.writeFileSync(`./lib/config/Gerais/Backup/${maxBackups}-${whotobackup[i]}`, JSON.stringify(fileReadBk))
	}
	
	// Forçar recarregamento caso obtenha erros
	komi.onStateChanged(async (state) => {
		console.log(color('[RELOAD]', 'red'), color('Isso pode ser ignorado →', 'lime'), color(state, 'yellow'))
		if (state === 'UNPAIRED' || state === 'CONFLICT' || state === 'UNLAUNCHED') await komi.forceRefocus()
	})
   komi.onButton( async (message) => {     
		const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList, selectedButtonId } = message    
		 let { pushname, verifiedName, formattedName } = sender   
		 pushname = pushname ||  verifiedName || formattedName 
	//	 Pokemon.setLanguage('english');var region = config.Language
	//	 var mess = mylang(region);moment.tz.setDefault('America/Sao_Paulo').locale('pt_BR')
	//	 const time = moment(t * 1000).format('DD/MM HH:mm:ss')
		//const processTime = (timestamp, now) => { return moment.duration(now - moment(timestamp * 1000)).asSeconds() }
		 switch(selectedButtonId) {
			case 'dono':
				await komi.sendText(from, `wa.me/559889110607 , fale com o dono o valor que queira pagar pelo vip ` ,id)
				break
				case'pix':
				await komi.sendText(from, `Pix = chave aleatoria -> 23a1f304-857c-4d95-a810-d28a5fb00a50 ` ,id)
				break

		}
	  }) 

	  komi.onButton( async (message) => {     
		  const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, mentionedJidList, selectedButtonId } = message    
	      let { pushname, verifiedName, formattedName } = sender 
	      pushname = pushname || verifiedName || formattedName
 switch(selectedButtonId) {
      case 'valores':
		  await komi.sendText(from, 
		`ESSE SÃO OS VALORES DE VIP

		 *VIP PRA GP* 
		
*50 membros = 10 reais*
*50 a 100 membros = 15 reais*
*100 a 150 membros = 30 reais*
*150 a 200 membros = 25 reais*
*200+ membros = 40 reais*

	*Duração de 30 dias no seu grupo*
		
		*VIP PESSOAL*
		
*💲R$02 = 02 dias*
 *💲R$05 = 10 dias*  
 *💲R$15 = 30 dias*
 *💲R$35 = Permanente*
  
*💲Pagamento somente via Pix*`, id)
break

 }
})
	// Lê as mensagens, se você quer usar o watchFile, mude para o require | Ative a await se quiser auto limpeza de cache, 3000 significa limpeza a cada 3000 mensagens
	komi.onMessage(async (message) => {
		//await komi.getAmountOfLoadedMessages().then(async (msg) => { if (msg >= 3000) { await komi.cutMsgCache();await komi.cutChatCache() } })
		await kconfig(komi, message) // require('./config')(komi, message)
	})
	// Você pode rodar certos comandos(/enviar por exemplo) pelo próprio WhatsApp da BOT trocando o "komi.onMessage" por "komi.onAnyMessage", não recomendado.
	// Caso deseje, faça um "wa.me" do próprio número e rode os comandos em um chat consigo mesmo.

	// Funções para caso seja adicionada em um grupo
	komi.onAddedToGroup(async (chat) => {
		const lmtgru = await komi.getAllGroups()
		const totalMem = chat.groupMetadata.participants.length
		if (chat.groupMetadata.participants.includes(config.Owner)) {
			await komi.sendText(chat.id, mylang(config.Language).novogrupo())
		} else if (totalMem < config.Min_Membros) {
			await komi.sendText(chat.id, mylang(config.Language).noreq(totalMem))
			await komi.deleteChat(chat.id)
			await komi.leaveGroup(chat.id)
		} else if (lmtgru.length > config.Max_Groups) {
			await komi.sendText(chat.id, mylang(config.Language).cheio(lmtgru))
			await komi.deleteChat(chat.id)
			await komi.leaveGroup(chat.id)
		} else { komi.sendText(chat.id, mylang(config.Language).novogrupo()) }
		console.log(color('[NOVO]', 'red'), color(`Fui adicionado ao grupo ${chat.contact.name} e eles tem ${totalMem} membros.`, 'yellow'))
	})

	// Configuração do welcome
	komi.onGlobalParticipantsChanged(async (event) => {
		const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'))
		const welcmsg = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'))
		const numebot = await komi.getHostNumber() + '@c.us'
		const isMyBot = event.who.includes(numebot)
		const isWelkom = functions[0].welcome.includes(event.chat)
		const isFake = functions[0].fake.includes(event.chat)
		const fake = event.who.startsWith(config.DDI)
		const isAnti = functions[0].anti.includes(event.chat)
		const fuck = functions[0].blacklist.includes(event.who)
		const eChat = await komi.getContact(event.who)
		let { pushname, verifiedName, formattedName } = eChat
		pushname = pushname || verifiedName || formattedName
		const gChat = await komi.getChatById(event.chat)
		const { contact, groupMetadata, name } = gChat
		try {
			if (event.action == 'add') {
				if (isAnti && fuck && !isMyBot) {
					await komi.sendText(event.chat, mylang(config.Language).entrace())
					await sleep(2000)
					await komi.removeParticipant(event.chat, event.who)
					await komi.contactBlock(event.who) // Evita ser travado por putinhos
					console.log(color('[BLACKLIST]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por ter sido colocado na blacklist...`, 'yellow'))
				} else if (isFake && !fake && !isMyBot) {
					await komi.sendTextWithMentions(event.chat, mylang(config.Language).nofake(event))
					await sleep(4000) // Anti-fake e Black-List não tem anti-flood por segurança, use a var welcOn para inserir
					await komi.removeParticipant(event.chat, event.who)
					await komi.contactBlock(event.who) // Evita ser travado por putinhos
					console.log(color('[FAKE]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) foi banido do ${name} por usar número falso ou ser de fora do país...`, 'yellow'))
				} else if (isWelkom && !isMyBot && welcOn == 0 && !fuck && fake) {
					welcOn = 1;var onlyThis = 0
					for (let o = 0; o < welcmsg.length; o++) { if (Object.keys(welcmsg[o]).includes(event.chat)) { Object.keys(welcmsg[o]).forEach(async (i) => { await komi.sendText(event.chat, welcmsg[o][i]) });onlyThis = 1;break } }
					if (onlyThis == 1) { console.log(color('[ENTROU]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) entrou no grupo ${name}...`, 'yellow'));return onlyThis = 0 }
					var profile = await komi.getProfilePicFromServer(event.who)
					if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
					const welcomer = await new canvas.Welcome().setUsername(pushname).setDiscriminator(event.who.substring(6, 10)).setMemberCount(groupMetadata.participants.length).setGuildName(name).setAvatar(profile).setText("title", `BEM VINDO`).setText("message", `VOCÊ ESTÁ NO {server}`).setText("member-count", `VOCÊ É O MEMBRO N° {count}`).setColor('border', '#00100C').setColor('username-box', '#00100C').setColor('discriminator-box', '#00100C').setColor('message-box', '#00100C').setColor('title', '#6577AF').setOpacity("username-box", 0.6).setOpacity("discriminator-box", 0.6).setOpacity("message-box", 0.6).setOpacity("border", 0.4).setBackground('https://telegra.ph/file/0f9c899bd9cc4430a4a05.jpg').toAttachment()
					await komi.sendFile(event.chat, `data:image/png;base64,${welcomer.toBuffer().toString('base64')}`, 'welcome.png', mylang(config.Language).welcome(pushname, name))
					//await komi.sendPtt(event.chat, 'https://www.myinstants.com/media/sounds/welcome-mercador-resident-evil-4.mp3')
					welcOn = 0
					console.log(color('[ENTROU]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) entrou no grupo ${name}...`, 'yellow'))
				}
			} else if (event.action == 'remove' && isWelkom && !isMyBot && abayo == 0 && !fuck && fake) {
				abayo = 1
				var profile = await komi.getProfilePicFromServer(event.who)
				if (profile == '' || profile == undefined) profile = 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQcODjk7AcA4wb_9OLzoeAdpGwmkJqOYxEBA&usqp=CAU'
				const bye = await new canvas.Goodbye().setUsername(pushname).setDiscriminator(event.who.substring(6, 10)).setMemberCount(groupMetadata.participants.length).setGuildName(name).setAvatar(profile).setText("title", `ADEUS`).setText("message", `SAIU DO {server}`).setText("member-count", `ELE FOI O MEMBRO N° {count}`).setColor('border', '#00100C').setColor('username-box', '#00100C').setColor('discriminator-box', '#00100C').setColor('message-box', '#00100C').setColor('title', '#6577AF').setOpacity("username-box", 0.6).setOpacity("discriminator-box", 0.6).setOpacity("message-box", 0.6).setOpacity("border", 0.4).setBackground('https://telegra.ph/file/0f9c899bd9cc4430a4a05.jpg').toAttachment()
				await komi.sendFile(event.chat, `data:image/png;base64,${bye.toBuffer().toString('base64')}`, 'welcome.png', mylang(config.Language).bye(pushname))
				//await komi.sendPtt(event.chat, 'https://media1.vocaroo.com/mp3/1aNWZ9vQa2CT')
				abayo = 0
				console.log(color('[SAIU/BAN]', 'red'), color(`${pushname} - (${event.who.replace('@c.us', '')}) saiu ou foi banido do grupo ${name}...`, 'yellow'))
			}
		} catch (err) { console.log(err);welcOn = 0;abayo = 0 }
	})

	// Bloqueia na call
	komi.onIncomingCall(async (callData) => {
		try {
			await komi.sendText(callData.peerJid, mylang(config.Language).blockcalls())
			await komi.contactBlock(callData.peerJid)
		} catch { await komi.contactBlock(callData.peerJid) }
		console.log(color('[CALL]', 'red'), color(`${callData.peerJid.replace('@c.us', '')} foi bloqueado por me ligar...`, 'yellow'))
	})

}

// Cria uma sessão da Íris
create(options(start)).then((komi) => start(komi)).catch((err) => console.error(err))
