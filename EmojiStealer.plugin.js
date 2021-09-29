/**
 * @name EmojiStealer
 * @source https://github.com/lol219
 */
 class EmojiStealer {
    getName() {return "EmojiStealer";}
    getDescription() {return "Copy the URL of any emoji and call it using a simple command, allowing you to use emojis at will. [**By using simple commands :** `steal$ <emojiname>  or <emojiurl>` and you can get them by using : `e$ <emojiname>`gets the larger 64x64 image , and `es$ <emojiname>` gets the smaller 32x32 version.]";}
    getVersion() {return "1.0.1";}
    getAuthor() {return "Alexandro";}

    start() {
        if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing",`The library plugin needed for ${this.getName()} is missing.<br /><br /> <a href="https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js" target="_blank">Click here to download the library!</a>`);
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/lol219/EmojiStealer/main/EmojiStealer.plugin.js");
      }

    stop() {}
}


module.exports = (() =>
{
    const config =
    {
		info:
		{
			name: "EmojiStealer",
			authors:
			[
				{
					name: "Alexandro",
					discord_id: "0000000000",
					github_username: "lol219"

				}
			],
			version: "1.0.1",
			description: "Copy the URL of any emoji and call it using a simple command, allowing you to use emojis at will. [**By using simple commands :** `steal$ <emojiname>  or <emojiurl>` and you can get them by using : `e$ <emojiname>`gets the larger 64x64 image , and `es$ <emojiname>` gets the smaller 32x32 version.]"
		},
		changelog:
		[
			{
				title: "1.0.1",
				type: "added",
				items:
				[
					"Made the emoji sizes 64x64 pixels"
				]
			}
		]
    };



    return (([Plugin, Api]) => {

		const plugin = (Plugin, Api) =>
		{
			const { DiscordModules, Patcher } = Api;
			 if(!BdApi.Plugins.get("AlexLib") && !BdApi.getData(config.info.name)){
                BdApi.saveData(config.info.name);
                BdApi.showConfirmationModal("Missing Library", 
                    [`Do you want to download a Alexandro plugin library ? it needs it `],
                    {
                        confirmText: "Download",
                        cancelText: "Cancel",
                        onConfirm: () => {
                            require("request").get("https://raw.githubusercontent.com/lol219/AlexLib/main/AlexLib.plugin.js", (error, response, body) => {
                                if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/lol219/AlexLib/main/AlexLib.plugin.js");
                                else require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "AlexLib.plugin.js"), body, ()=>{
                                    window.setTimeout(()=>BdApi.Plugins.enable("AlexLib"), 1000);
                                });
                            });
                        }
                    }
                );
            }

			return class EmojiStealer extends Plugin
			{
				constructor()
				{
					super();
				}
	
				onStart()
				{
					Patcher.after(DiscordModules.MessageActions, "sendMessage", (_, [, message]) =>
					{
						const content = message.content.toLowerCase();

						switch (content.split("$")[0])
						{
							case "steal":
								const link = (/^steal\$ /g).exec(content);

								const pieces = message.content.substr(link[0].length, message.content.length).split(" ")

								if (pieces.length > 2){
									message.content = ("Error. More than two fields detected.")
									break;
								}

								const name = pieces[0]
								const url = pieces[1]

								BdApi.saveData("EmojiStealer", name, url)

								message.content = ("Success")
								
								break;

							case "e":
								const data = (/^e\$ /g).exec(content);

								const key = message.content.substr(data[0].length, message.content.length).split(" ")

								if (key.length > 1){
									message.content = ("Error. More than one field detected.")
									break;
								}

								const emojiUrl = BdApi.loadData("EmojiStealer", key[0]);

								message.content = (emojiUrl + '&size=64');
							
							case "es":
								const es = (/^es\$ /g).exec(content);

								const keyes = message.content.substr(es[0].length, message.content.length).split(" ")

								if (keyes.length > 1){
									message.content = ("Error. More than one field detected.")
									break;
								}

								const emojiUrles = BdApi.loadData("EmojiStealer", keyes[0]);

								message.content = (emojiUrles + '&size=32');
						}
					});
				}
	
				onStop()
				{
					Patcher.unpatchAll();
				}
			}
		};


        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
