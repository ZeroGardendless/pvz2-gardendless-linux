import { c as e, f as t, s as n, t as r } from "../../platform/CloudJson.js";
import { i } from "../../platform/Events.js";
import { a, s as o, u as s } from "../../platform/CloudSelection.js";
import { t as c } from "../../platform/CloudPortablePreferences.js";
var l = { en: { "cloud.native.error.CLOUD_HTTP_409:cloud_device_limit": `Device limit reached. Remove an old device in Nest\u2019s game authorization settings.`, "cloud.native.error.CLOUD_HTTP_429:cloud-upload-window-limit": `Upload limit reached. Try again later.`, "cloud.native.error.CLOUD_HTTP_429:cloud-download-window-limit": `Download limit reached. Try again later.`, "cloud.native.error.CLOUD_BACKUP_INCOMPLETE": `The cloud backup is incomplete. Finish uploading on the source device, then retry.`, "cloud.native.simpleUpload": `Upload`, "cloud.native.error.CLOUD_CANDIDATE_ACCOUNT": `The pending backup belongs to a previous login. Reopen Cloud and capture a new backup.`, "cloud.native.waitingCleanup": `Waiting for cloud cleanup; continuing in {0} seconds.`, "cloud.native.stopWaiting": `Stop waiting`, "cloud.native.waitingUpload": `Waiting {0} seconds for the next upload, then continuing automatically.`, "cloud.native.simpleDownload": `Download`, "cloud.native.simpleSync": `Sync`, "cloud.native.retry": `Retry`, "cloud.native.latestBackup": `Latest backup: {0}`, "cloud.native.confirmDownloadText": `Replace local progress and included settings with the cloud backup?`, "cloud.native.confirmDownload": `Replace with cloud backup`, "cloud.native.syncConflict": `Local and cloud backups differ. Choose which one to use.`, "cloud.native.useLocal": `Use local`, "cloud.native.useCloud": `Use cloud`, "cloud.native.synced": `Synced.`, "cloud.native.error.CLOUD_UPLOAD_PENDING": `The upload has not completed. Retry the same upload.`, "cloud.native.error.CLOUD_EMPTY_SELECTION": `Choose at least one player, setting group or shared data block.`, "cloud.native.device": `Device name`, "cloud.native.readOnly": `Authorize retrieval only`, "cloud.native.connect": `Connect Nest`, "cloud.native.cancel": `Cancel authorization`, "cloud.native.refresh": `Refresh`, "cloud.native.disconnect": `Disconnect device`, "cloud.native.progress": `Progress`, "cloud.native.preferences": `Preferences`, "cloud.native.preview": `Preview`, "cloud.native.export": `Export backup`, "cloud.native.next": `Load more`, "cloud.native.empty": `No cloud backups.`, "cloud.native.quota": `{0} of {1} MB used`, "cloud.native.players": `{0} players \xB7 Game {1}`, "cloud.native.unlinked": `Connect your Nest account.`, "cloud.native.authorizing": `Complete authorization in your browser, then return to this running game.`, "cloud.native.readOnlyState": `Retrieval only`, "cloud.native.ready": `Connected`, "cloud.native.failed": `Cloud operation failed. Retry when ready.`, "cloud.native.previewTitle": `Backup preview`, "cloud.native.entirePlayers": `Review the selected restore.`, "cloud.native.modSettingsExcluded": `Author mod settings and custom files are not included.`, "cloud.native.saved": `Backup exported.`, "cloud.native.blocked": `Cloud integration is awaiting device checks.`, "cloud.native.confirmRestore": `Confirm restore`, "cloud.native.rollback": `Keep original save`, "cloud.native.recovery": `Interrupted restore: roll back before starting the game.`, "cloud.native.recoveryChanged": `Startup changed the save. Restore the original backup and discard these changes?`, "cloud.native.restoreOriginal": `Restore original backup`, "cloud.native.keepCurrent": `Keep current data`, "cloud.native.reviewCounts": `Players: {0} locally \u2192 {1} after restore`, "cloud.native.recoveryRestart": `Restart recovery`, "cloud.native.restoring": `Restoring. Keep the application open.`, "cloud.native.cancelOperation": `Cancel pending operation`, "cloud.native.capture": `Back up\u2026`, "cloud.native.restore": `Save locally and review restore`, "cloud.native.restartPending": `Return to the main menu. The game will restart for this operation.`, "cloud.native.captured": `Local backup prepared.`, "cloud.native.reviewUpload": `Review prepared backup`, "cloud.native.upload": `Upload prepared backup`, "cloud.native.continueUpload": `Check or retry this upload`, "cloud.native.cancelUpload": `Cancel this upload`, "cloud.native.uploadReview": `Upload replaces the cloud head. Compare the local backup and current cloud backup first.`, "cloud.native.uploadStatus": `Upload state: {0}`, "cloud.native.withPreferences": `Include portable GP-Next preferences`, "cloud.native.field.theme": `Theme`, "cloud.native.field.locale": `GP-Next language`, "cloud.native.field.builtinTranslations": `Built-in translations`, "cloud.native.field.hpOverlay": `HP labels`, "cloud.native.field.overlayHotkey": `Panel shortcut`, "cloud.native.field.scrollSensitivity": `Scroll sensitivity`, "cloud.native.field.frameRate": `Frame rate`, "cloud.native.selectPlayer": `Player to select after restore`, "cloud.native.selectBackup": `Choose backup contents`, "cloud.native.selectRestore": `Choose restore contents`, "cloud.native.selectAll": `Select all players`, "cloud.native.selectNone": `Deselect all players`, "cloud.native.gameSettings": `Original game settings`, "cloud.native.newPlayer": `Create a new player`, "cloud.native.overwritePlayer": `Overwrite a local player`, "cloud.native.chooseTarget": `Choose the local player to overwrite`, "cloud.native.keepActive": `Keep the current player; use the first if none exists`, "cloud.native.importActive": `Imported {0}. {1}`, "cloud.native.prepareCapture": `Back up selected data`, "cloud.native.menuForRestore": `Return to the main menu to apply the restore; the game keeps running.`, "cloud.native.capturing": `Preparing a consistent backup\u2026`, "cloud.native.uploading": `Uploading backup\u2026`, "cloud.native.backedUp": `Backup completed.`, "cloud.native.prepareRestore": `Review selected restore`, "cloud.native.excludeMod": `Do not import save data for {0}`, "cloud.native.opaqueData": `Mod data cannot follow a different player identity without mod support. Explicitly exclude it or overwrite its original identity.`, "cloud.native.globalData": `Shared mod data: {0}`, "cloud.native.globalScope": `Shared by every player; restored as a whole block.`, "cloud.native.newSummary": `New player {1}: {0}`, "cloud.native.overwriteSummary": `Overwrite player {1} ({2}) with {0}`, "cloud.native.activeSummary": `Active player after restore: {0}. {1}`, "cloud.native.excludedMods": `Not imported: {0}`, "cloud.native.replacedMods": `Existing target save data replaced: {0}`, "cloud.native.preferencesFirst": `Upload preferences first. After they commit, upload the linked progress from this same prepared backup.`, "cloud.native.uploadPreferencesFirst": `Review and upload preferences first`, "cloud.native.continueSave": `Review linked progress next`, "cloud.native.uploadPending": `An upload is still pending. Use \u201CCheck or retry this upload\u201D before starting another.`, "cloud.native.gameField.Language": `Game language`, "cloud.native.gameField.MusicVolume": `Music volume`, "cloud.native.gameField.SFXVolume": `Sound volume`, "cloud.native.gameField.MusicSpeedMin": `Minimum music speed`, "cloud.native.gameField.MusicSpeedMax": `Maximum music speed`, "cloud.native.gameField.CardsLayer": `Card layout`, "cloud.native.gameField.ShowKeyTips": `Shortcut hints`, "cloud.native.gameField.PlantKeyTips": `Plant shortcuts`, "cloud.native.gameField.ClassicCardBG": `Classic card background`, "cloud.native.error.CLOUD_BACKUP_REQUIRES_PLAYERS": `Select a player to back up original game settings or shared data. Only GP-Next preferences can be backed up independently.`, "cloud.native.error.CLOUD_PLAYER_TARGET": `Choose one distinct local target for each overwrite.`, "cloud.native.error.CLOUD_PLAYER_SELECTION": `Select the players again; this selection is invalid.`, "cloud.native.error.CLOUD_ACTIVE_PLAYER": `Choose an existing player or a selected imported player.`, "cloud.native.error.CLOUD_SELECTION_CHANGED": `The source or local data changed. Cancel and prepare again.`, "cloud.native.error.CLOUD_MOD_DATA_REMAP_UNSUPPORTED": `Explicitly exclude this mod data, or overwrite its original identity. It cannot follow this identity change.`, "cloud.native.error.CLOUD_GLOBAL_REMAP_UNSUPPORTED": `Keep local shared data here: import requires unchanged player identities and positions.`, "cloud.native.error.CLOUD_SETTINGS_MISSING": `This backup has no portable original game settings.`, "cloud.native.error.CLOUD_LOCAL_LIMIT": `The combined players or mod data exceed the limit. Select fewer players.`, "cloud.native.compare.equal": `Local and cloud content match.`, "cloud.native.compare.choose": `No shared baseline. Choose which backup to keep.`, "cloud.native.compare.remote_changed": `The cloud backup changed since the shared baseline.`, "cloud.native.compare.local_changed": `Only the local backup changed since the shared baseline.`, "cloud.native.compare.conflict": `Both backups changed. Review them before replacing the cloud head.`, "cloud.title": `Cloud Save`, "cloud.unavailable": `Cloud Save is not available yet.` }, "zh-CN": { "cloud.native.error.CLOUD_HTTP_409:cloud_device_limit": `\u8FDE\u63A5\u8BBE\u5907\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u5728 Nest \u7684\u6E38\u620F\u6388\u6743\u8BBE\u7F6E\u79FB\u9664\u65E7\u8BBE\u5907\u3002`, "cloud.native.error.CLOUD_HTTP_429:cloud-upload-window-limit": `\u4E0A\u4F20\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002`, "cloud.native.error.CLOUD_HTTP_429:cloud-download-window-limit": `\u4E0B\u8F7D\u6B21\u6570\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u3002`, "cloud.native.error.CLOUD_BACKUP_INCOMPLETE": `\u4E91\u5907\u4EFD\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BF7\u5728\u4E0A\u4F20\u8BBE\u5907\u5B8C\u6210\u4E0A\u4F20\u540E\u91CD\u8BD5\u3002`, "cloud.native.simpleUpload": `\u4E0A\u4F20`, "cloud.native.error.CLOUD_CANDIDATE_ACCOUNT": `\u5F85\u4E0A\u4F20\u5907\u4EFD\u5C5E\u4E8E\u4E0A\u6B21\u767B\u5F55\u3002\u8BF7\u91CD\u65B0\u6253\u5F00\u4E91\u7A97\u53E3\uFF0C\u518D\u4E0A\u4F20\u5F53\u524D\u6570\u636E\u3002`, "cloud.native.waitingCleanup": `\u7B49\u5F85\u4E91\u7AEF\u6E05\u7406\uFF0C{0} \u79D2\u540E\u7EE7\u7EED\u3002`, "cloud.native.stopWaiting": `\u6682\u505C\u7B49\u5F85`, "cloud.native.waitingUpload": `\u7B49\u5F85 {0} \u79D2\u540E\u81EA\u52A8\u7EE7\u7EED\u4E0A\u4F20\u3002`, "cloud.native.simpleDownload": `\u4E0B\u8F7D`, "cloud.native.simpleSync": `\u540C\u6B65`, "cloud.native.retry": `\u91CD\u8BD5`, "cloud.native.latestBackup": `\u6700\u8FD1\u5907\u4EFD\uFF1A{0}`, "cloud.native.confirmDownloadText": `\u7528\u4E91\u5907\u4EFD\u8986\u76D6\u672C\u673A\u8FDB\u5EA6\u53CA\u5176\u4E2D\u5305\u542B\u7684\u8BBE\u7F6E\uFF1F`, "cloud.native.confirmDownload": `\u4F7F\u7528\u4E91\u5907\u4EFD\u8986\u76D6`, "cloud.native.syncConflict": `\u672C\u673A\u4E0E\u4E91\u7AEF\u5907\u4EFD\u6709\u5DEE\u5F02\uFF0C\u8BF7\u9009\u62E9\u4F7F\u7528\u54EA\u4E00\u4EFD\u3002`, "cloud.native.useLocal": `\u4F7F\u7528\u672C\u673A`, "cloud.native.useCloud": `\u4F7F\u7528\u4E91\u7AEF`, "cloud.native.synced": `\u5DF2\u540C\u6B65\u3002`, "cloud.native.error.CLOUD_UPLOAD_PENDING": `\u4E0A\u4F20\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BF7\u91CD\u8BD5\u540C\u4E00\u6B21\u4E0A\u4F20\u3002`, "cloud.native.error.CLOUD_EMPTY_SELECTION": `\u8BF7\u9009\u62E9\u81F3\u5C11\u4E00\u4F4D\u73A9\u5BB6\u3001\u4E00\u7EC4\u8BBE\u7F6E\u6216\u5171\u4EAB\u6570\u636E\u3002`, "cloud.native.device": `\u8BBE\u5907\u540D\u79F0`, "cloud.native.readOnly": `\u4EC5\u6388\u6743\u53D6\u56DE\u5B58\u6863`, "cloud.native.connect": `\u8FDE\u63A5 Nest`, "cloud.native.cancel": `\u53D6\u6D88\u6388\u6743`, "cloud.native.refresh": `\u5237\u65B0`, "cloud.native.disconnect": `\u65AD\u5F00\u6B64\u8BBE\u5907`, "cloud.native.progress": `\u6E38\u620F\u8FDB\u5EA6`, "cloud.native.preferences": `GP-Next \u504F\u597D`, "cloud.native.preview": `\u9884\u89C8`, "cloud.native.export": `\u5BFC\u51FA\u5907\u4EFD`, "cloud.native.next": `\u52A0\u8F7D\u66F4\u591A`, "cloud.native.empty": `\u6682\u65E0\u4E91\u5907\u4EFD\u3002`, "cloud.native.quota": `\u5DF2\u7528 {0} / {1} MB`, "cloud.native.players": `{0} \u4F4D\u73A9\u5BB6 \xB7 \u6E38\u620F {1}`, "cloud.native.unlinked": `\u8FDE\u63A5 Nest \u8D26\u53F7\u3002`, "cloud.native.authorizing": `\u8BF7\u5728\u6D4F\u89C8\u5668\u5B8C\u6210\u6388\u6743\u540E\uFF0C\u56DE\u5230\u5F53\u524D\u8FD0\u884C\u7684\u6E38\u620F\u3002`, "cloud.native.readOnlyState": `\u4EC5\u53EF\u53D6\u56DE`, "cloud.native.ready": `\u5DF2\u8FDE\u63A5`, "cloud.native.failed": `\u4E91\u64CD\u4F5C\u5931\u8D25\uFF0C\u53EF\u7A0D\u540E\u91CD\u8BD5\u3002`, "cloud.native.previewTitle": `\u5907\u4EFD\u9884\u89C8`, "cloud.native.entirePlayers": `\u8BF7\u6838\u5BF9\u672C\u6B21\u9009\u62E9\u7684\u6062\u590D\u5185\u5BB9\u3002`, "cloud.native.modSettingsExcluded": `\u4F5C\u8005\u6A21\u7EC4\u8BBE\u7F6E\u548C\u81EA\u5B9A\u4E49\u6587\u4EF6\u4E0D\u5728\u5907\u4EFD\u8303\u56F4\u5185\u3002`, "cloud.native.saved": `\u5907\u4EFD\u5DF2\u5BFC\u51FA\u3002`, "cloud.native.blocked": `\u4E91\u5BA2\u6237\u7AEF\u6B63\u5728\u7B49\u5F85\u8BBE\u5907\u9A8C\u6536\u3002`, "cloud.native.confirmRestore": `\u786E\u8BA4\u6062\u590D`, "cloud.native.rollback": `\u4FDD\u7559\u539F\u5B58\u6863`, "cloud.native.recovery": `\u6062\u590D\u66FE\u88AB\u4E2D\u65AD\uFF0C\u9700\u8981\u5148\u56DE\u6EDA\u624D\u80FD\u542F\u52A8\u6E38\u620F\u3002`, "cloud.native.recoveryChanged": `\u542F\u52A8\u671F\u95F4\u5B58\u6863\u5DF2\u53D8\u5316\u3002\u662F\u5426\u653E\u5F03\u8FD9\u4E9B\u53D8\u5316\uFF0C\u6062\u590D\u539F\u5907\u4EFD\uFF1F`, "cloud.native.restoreOriginal": `\u6062\u590D\u539F\u5907\u4EFD`, "cloud.native.keepCurrent": `\u4FDD\u7559\u5F53\u524D\u6570\u636E`, "cloud.native.reviewCounts": `\u73A9\u5BB6\u6570\u91CF\uFF1A\u672C\u673A {0} \u2192 \u6062\u590D\u540E {1}`, "cloud.native.recoveryRestart": `\u91CD\u65B0\u542F\u52A8\u6062\u590D\u6D41\u7A0B`, "cloud.native.restoring": `\u6B63\u5728\u6062\u590D\uFF0C\u8BF7\u4FDD\u6301\u5E94\u7528\u8FD0\u884C\u3002`, "cloud.native.cancelOperation": `\u53D6\u6D88\u5F85\u5904\u7406\u64CD\u4F5C`, "cloud.native.capture": `\u5907\u4EFD\u2026`, "cloud.native.restore": `\u4FDD\u5B58\u672C\u673A\u8FDB\u5EA6\u5E76\u5BA1\u9605\u6062\u590D`, "cloud.native.restartPending": `\u8BF7\u8FD4\u56DE\u4E3B\u83DC\u5355\uFF0C\u6E38\u620F\u5C06\u91CD\u542F\u6267\u884C\u6B64\u64CD\u4F5C\u3002`, "cloud.native.captured": `\u672C\u673A\u5907\u4EFD\u5DF2\u51C6\u5907\u3002`, "cloud.native.reviewUpload": `\u5BA1\u9605\u5DF2\u51C6\u5907\u7684\u5907\u4EFD`, "cloud.native.upload": `\u4E0A\u4F20\u5DF2\u51C6\u5907\u7684\u5907\u4EFD`, "cloud.native.continueUpload": `\u68C0\u67E5\u6216\u91CD\u8BD5\u6B64\u4E0A\u4F20`, "cloud.native.cancelUpload": `\u53D6\u6D88\u6B64\u4E0A\u4F20`, "cloud.native.uploadReview": `\u4E0A\u4F20\u4F1A\u66F4\u65B0\u4E91\u7AEF\u5F53\u524D\u5907\u4EFD\uFF0C\u8BF7\u5148\u6BD4\u8F83\u672C\u673A\u5907\u4EFD\u4E0E\u5F53\u524D\u4E91\u5907\u4EFD\u3002`, "cloud.native.uploadStatus": `\u4E0A\u4F20\u72B6\u6001\uFF1A{0}`, "cloud.native.withPreferences": `\u5305\u542B\u53EF\u8FC1\u79FB\u7684 GP-Next \u504F\u597D`, "cloud.native.field.theme": `\u4E3B\u9898`, "cloud.native.field.locale": `GP-Next \u8BED\u8A00`, "cloud.native.field.builtinTranslations": `\u5185\u7F6E\u7FFB\u8BD1`, "cloud.native.field.hpOverlay": `\u8840\u91CF\u6807\u7B7E`, "cloud.native.field.overlayHotkey": `\u9762\u677F\u5FEB\u6377\u952E`, "cloud.native.field.scrollSensitivity": `\u6EDA\u52A8\u7075\u654F\u5EA6`, "cloud.native.field.frameRate": `\u5E27\u7387`, "cloud.native.selectPlayer": `\u6062\u590D\u540E\u9009\u4E2D\u7684\u73A9\u5BB6`, "cloud.native.selectBackup": `\u9009\u62E9\u5907\u4EFD\u5185\u5BB9`, "cloud.native.selectRestore": `\u9009\u62E9\u6062\u590D\u5185\u5BB9`, "cloud.native.selectAll": `\u5168\u9009\u73A9\u5BB6`, "cloud.native.selectNone": `\u53D6\u6D88\u5168\u9009\u73A9\u5BB6`, "cloud.native.gameSettings": `\u539F\u6E38\u620F\u8BBE\u7F6E`, "cloud.native.newPlayer": `\u65B0\u5EFA\u73A9\u5BB6`, "cloud.native.overwritePlayer": `\u8986\u76D6\u672C\u5730\u73A9\u5BB6`, "cloud.native.chooseTarget": `\u9009\u62E9\u8981\u8986\u76D6\u7684\u672C\u5730\u73A9\u5BB6`, "cloud.native.keepActive": `\u4FDD\u7559\u5F53\u524D\u73A9\u5BB6\uFF1B\u672C\u673A\u6CA1\u6709\u73A9\u5BB6\u65F6\u4F7F\u7528\u7B2C\u4E00\u4F4D`, "cloud.native.importActive": `\u5BFC\u5165 {0}. {1}`, "cloud.native.prepareCapture": `\u5907\u4EFD\u6240\u9009\u6570\u636E`, "cloud.native.menuForRestore": `\u8FD4\u56DE\u4E3B\u83DC\u5355\u540E\u5E94\u7528\u6062\u590D\uFF0C\u6E38\u620F\u4F1A\u7EE7\u7EED\u8FD0\u884C\u3002`, "cloud.native.capturing": `\u6B63\u5728\u51C6\u5907\u4E00\u81F4\u7684\u5907\u4EFD\u2026`, "cloud.native.uploading": `\u6B63\u5728\u4E0A\u4F20\u5907\u4EFD\u2026`, "cloud.native.backedUp": `\u5907\u4EFD\u5B8C\u6210\u3002`, "cloud.native.prepareRestore": `\u5BA1\u9605\u6240\u9009\u6062\u590D`, "cloud.native.excludeMod": `\u4E0D\u5BFC\u5165 {0} \u7684\u5B58\u6863\u7EA7\u6570\u636E`, "cloud.native.opaqueData": `\u6A21\u7EC4\u6CA1\u6709\u63D0\u4F9B\u8DE8\u8EAB\u4EFD\u590D\u5236\u652F\u6301\u3002\u8BF7\u660E\u786E\u6392\u9664\u5176\u6570\u636E\uFF0C\u6216\u8986\u76D6\u539F\u6765\u7684\u73A9\u5BB6\u8EAB\u4EFD\u3002`, "cloud.native.globalData": `\u5171\u4EAB\u6A21\u7EC4\u6570\u636E\uFF1A{0}`, "cloud.native.globalScope": `\u6240\u6709\u73A9\u5BB6\u5171\u4EAB\u6B64\u6570\u636E\uFF0C\u6062\u590D\u65F6\u6574\u5757\u66FF\u6362\u3002`, "cloud.native.newSummary": `\u65B0\u5EFA\u7B2C {1} \u4F4D\u73A9\u5BB6\uFF1A{0}`, "cloud.native.overwriteSummary": `\u7528 {0} \u8986\u76D6\u7B2C {1} \u4F4D\u73A9\u5BB6\uFF08{2}\uFF09`, "cloud.native.activeSummary": `\u6062\u590D\u540E\u4F7F\u7528\uFF1A\u7B2C {0} \u4F4D\u73A9\u5BB6 {1}`, "cloud.native.excludedMods": `\u4E0D\u5BFC\u5165\uFF1A{0}`, "cloud.native.replacedMods": `\u66FF\u6362\u76EE\u6807\u539F\u6709\u5B58\u6863\u7EA7\u6570\u636E\uFF1A{0}`, "cloud.native.preferencesFirst": `\u5148\u4E0A\u4F20\u504F\u597D\u3002\u63D0\u4EA4\u6210\u529F\u540E\uFF0C\u518D\u4E0A\u4F20\u540C\u4E00\u5019\u9009\u7684\u5173\u8054\u8FDB\u5EA6\u3002`, "cloud.native.uploadPreferencesFirst": `\u5148\u5BA1\u9605\u5E76\u4E0A\u4F20\u504F\u597D`, "cloud.native.continueSave": `\u7EE7\u7EED\u5BA1\u9605\u5173\u8054\u8FDB\u5EA6`, "cloud.native.uploadPending": `\u4E0A\u4F20\u5C1A\u672A\u5B8C\u6210\uFF0C\u8BF7\u5148\u4F7F\u7528\u201C\u68C0\u67E5\u6216\u91CD\u8BD5\u6B64\u4E0A\u4F20\u201D\u3002`, "cloud.native.gameField.Language": `\u6E38\u620F\u8BED\u8A00`, "cloud.native.gameField.MusicVolume": `\u97F3\u4E50\u97F3\u91CF`, "cloud.native.gameField.SFXVolume": `\u97F3\u6548\u97F3\u91CF`, "cloud.native.gameField.MusicSpeedMin": `\u97F3\u4E50\u6700\u4F4E\u901F\u5EA6`, "cloud.native.gameField.MusicSpeedMax": `\u97F3\u4E50\u6700\u9AD8\u901F\u5EA6`, "cloud.native.gameField.CardsLayer": `\u5361\u7247\u5E03\u5C40`, "cloud.native.gameField.ShowKeyTips": `\u5FEB\u6377\u952E\u63D0\u793A`, "cloud.native.gameField.PlantKeyTips": `\u690D\u7269\u5FEB\u6377\u952E`, "cloud.native.gameField.ClassicCardBG": `\u7ECF\u5178\u5361\u7247\u80CC\u666F`, "cloud.native.error.CLOUD_BACKUP_REQUIRES_PLAYERS": `\u5907\u4EFD\u539F\u6E38\u620F\u8BBE\u7F6E\u6216\u5171\u4EAB\u6570\u636E\u65F6\uFF0C\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4F4D\u73A9\u5BB6\u3002\u4EC5 GP-Next \u504F\u597D\u53EF\u72EC\u7ACB\u5907\u4EFD\u3002`, "cloud.native.error.CLOUD_PLAYER_TARGET": `\u8BF7\u4E3A\u6BCF\u6B21\u8986\u76D6\u9009\u62E9\u4E0D\u540C\u7684\u672C\u5730\u76EE\u6807\u3002`, "cloud.native.error.CLOUD_PLAYER_SELECTION": `\u73A9\u5BB6\u9009\u62E9\u65E0\u6548\uFF0C\u8BF7\u91CD\u65B0\u9009\u62E9\u3002`, "cloud.native.error.CLOUD_ACTIVE_PLAYER": `\u8BF7\u9009\u62E9\u672C\u5730\u5DF2\u6709\u73A9\u5BB6\u6216\u672C\u6B21\u5DF2\u9009\u7684\u5BFC\u5165\u73A9\u5BB6\u3002`, "cloud.native.error.CLOUD_SELECTION_CHANGED": `\u6765\u6E90\u6216\u672C\u673A\u6570\u636E\u5DF2\u53D8\u5316\uFF0C\u8BF7\u53D6\u6D88\u5E76\u91CD\u65B0\u51C6\u5907\u3002`, "cloud.native.error.CLOUD_MOD_DATA_REMAP_UNSUPPORTED": `\u8BF7\u660E\u786E\u6392\u9664\u6B64\u6A21\u7EC4\u6570\u636E\uFF0C\u6216\u8986\u76D6\u539F\u6765\u7684\u8EAB\u4EFD\uFF1B\u5176\u6570\u636E\u4E0D\u80FD\u8DDF\u968F\u8EAB\u4EFD\u53D8\u66F4\u3002`, "cloud.native.error.CLOUD_GLOBAL_REMAP_UNSUPPORTED": `\u672C\u6B21\u8BF7\u4FDD\u7559\u672C\u673A\u5171\u4EAB\u6570\u636E\uFF1B\u5BFC\u5165\u8981\u6C42\u73A9\u5BB6\u8EAB\u4EFD\u548C\u4F4D\u7F6E\u4E0D\u53D8\u3002`, "cloud.native.error.CLOUD_SETTINGS_MISSING": `\u8FD9\u4EFD\u5907\u4EFD\u6CA1\u6709\u53EF\u8FC1\u79FB\u7684\u539F\u6E38\u620F\u8BBE\u7F6E\u3002`, "cloud.native.error.CLOUD_LOCAL_LIMIT": `\u5408\u5E76\u540E\u7684\u73A9\u5BB6\u6216\u6A21\u7EC4\u6570\u636E\u8D85\u51FA\u4E0A\u9650\uFF0C\u8BF7\u51CF\u5C11\u6240\u9009\u73A9\u5BB6\u3002`, "cloud.native.compare.equal": `\u672C\u673A\u548C\u4E91\u7AEF\u5185\u5BB9\u4E00\u81F4\u3002`, "cloud.native.compare.choose": `\u5C1A\u65E0\u5171\u540C\u57FA\u7EBF\uFF0C\u8BF7\u9009\u62E9\u8981\u4FDD\u7559\u7684\u5907\u4EFD\u3002`, "cloud.native.compare.remote_changed": `\u4E91\u7AEF\u5907\u4EFD\u5DF2\u5728\u5171\u540C\u57FA\u7EBF\u4E4B\u540E\u53D1\u751F\u53D8\u5316\u3002`, "cloud.native.compare.local_changed": `\u5171\u540C\u57FA\u7EBF\u4E4B\u540E\u4EC5\u672C\u673A\u5907\u4EFD\u53D1\u751F\u53D8\u5316\u3002`, "cloud.native.compare.conflict": `\u4E24\u4EFD\u5907\u4EFD\u90FD\u5DF2\u53D8\u5316\uFF0C\u8BF7\u6838\u5BF9\u540E\u518D\u66F4\u65B0\u4E91\u7AEF\u5F53\u524D\u5907\u4EFD\u3002`, "cloud.title": `\u4E91\u5B58\u6863`, "cloud.unavailable": `\u4E91\u5B58\u6863\u529F\u80FD\u6682\u672A\u5F00\u653E\u3002` }, es: { "cloud.native.error.CLOUD_HTTP_409:cloud_device_limit": `Se alcanz\xF3 el l\xEDmite de dispositivos. Elimina uno antiguo en los ajustes de autorizaci\xF3n del juego de Nest.`, "cloud.native.error.CLOUD_HTTP_429:cloud-upload-window-limit": `Se alcanz\xF3 el l\xEDmite de subidas. Int\xE9ntalo m\xE1s tarde.`, "cloud.native.error.CLOUD_HTTP_429:cloud-download-window-limit": `Se alcanz\xF3 el l\xEDmite de descargas. Int\xE9ntalo m\xE1s tarde.`, "cloud.native.error.CLOUD_BACKUP_INCOMPLETE": `La copia en la nube est\xE1 incompleta. Completa la subida en el dispositivo de origen y reintenta.`, "cloud.native.simpleUpload": `Subir`, "cloud.native.error.CLOUD_CANDIDATE_ACCOUNT": `La copia pendiente pertenece a una sesi\xF3n anterior. Vuelve a abrir Nube y crea una nueva copia.`, "cloud.native.waitingCleanup": `Esperando la limpieza de la nube; continuando en {0} segundos.`, "cloud.native.stopWaiting": `Dejar de esperar`, "cloud.native.waitingUpload": `Esperando {0} segundos para continuar la subida autom\xE1ticamente.`, "cloud.native.simpleDownload": `Descargar`, "cloud.native.simpleSync": `Sincronizar`, "cloud.native.retry": `Reintentar`, "cloud.native.latestBackup": `\xDAltima copia: {0}`, "cloud.native.confirmDownloadText": `\xBFReemplazar el progreso local y los ajustes incluidos con la copia de la nube?`, "cloud.native.confirmDownload": `Usar la copia de la nube`, "cloud.native.syncConflict": `Las copias local y de la nube son diferentes. Elige cu\xE1l usar.`, "cloud.native.useLocal": `Usar copia local`, "cloud.native.useCloud": `Usar nube`, "cloud.native.synced": `Sincronizado.`, "cloud.native.error.CLOUD_UPLOAD_PENDING": `La subida no se ha completado. Reintenta la misma subida.`, "cloud.native.error.CLOUD_EMPTY_SELECTION": `Activa al menos un elemento de copia en Ajustes.`, "cloud.title": `Guardado en la nube`, "cloud.unavailable": `La funci\xF3n de guardado en la nube a\xFAn no est\xE1 disponible.` } }, u = `en`;
function d(e2) {
  u = Object.hasOwn(l, e2) ? e2 : `en`;
}
function f(e2, ...t2) {
  return (l[u]?.[e2] ?? l.en[e2] ?? e2).replace(/\{(\d+)\}/g, (e3, n2) => t2[n2] ?? ``);
}
function p(e2) {
  let t2 = e2.mode === `capture`, n2 = e2.backupScope || { players: true, nativeSettings: true, preferenceFields: c }, r2 = { binding: e2.binding, nativeSettings: t2 ? n2.players && n2.nativeSettings && !!e2.source.nativeFields.length : !!e2.source.nativeFields.length, preferenceFields: e2.source.preferenceFields.filter((e3) => !t2 || n2.preferenceFields.includes(e3)) };
  return a(t2 ? { ...r2, playerIndices: n2.players ? e2.source.players.map((e3) => e3.index) : [], globalData: n2.players && !!e2.source.globalMods.length } : { ...r2, players: e2.source.players.map((e3) => ({ sourceIndex: e3.index, mode: `replace`, targetIndex: e3.index, excludeMods: [] })), globalData: e2.source.players.length ? `replace` : `keep`, activePlayer: e2.source.players.length ? { kind: `import`, index: e2.source.activeIndex ?? 0 } : null }, e2);
}
function m(e2) {
  if (!e2.length) throw Error(`CLOUD_EMPTY_SELECTION`);
  return e2.some((e3) => [`choose`, `conflict`].includes(e3)) || e2.includes(`local_changed`) && e2.includes(`remote_changed`) ? `conflict` : e2.includes(`local_changed`) ? `upload` : e2.includes(`remote_changed`) ? `download` : `equal`;
}
var h = document.querySelector(`main`), g = navigator.language.toLowerCase().startsWith(`zh`) ? `zh-CN` : `en`;
d(g), document.documentElement.lang = g;
var _ = document.querySelector(`h1`);
_ && (_.textContent = f(`cloud.title`)), window.addEventListener(`cloud-context`, (e2) => {
  [`en`, `zh-CN`, `es`].includes(e2.detail?.locale) && (g = e2.detail.locale, d(g), document.documentElement.lang = g, _ && (_.textContent = f(`cloud.title`))), [`light`, `dark`].includes(e2.detail?.theme) && (document.documentElement.dataset.theme = e2.detail.theme);
});
var v = null, y = false, b = null, x = null, S = false, C = null, w = false, T = ``, E = false, D = null, O = null, k = document.getElementById(`state`), A = document.getElementById(`error`), j = document.createElement(`section`), M = document.createElement(`section`);
j.className = `controls`, M.className = `results`, h.append(j, M), k.textContent = f(`cloud.unavailable`);
var N = (e2, t2) => {
  let n2 = document.createElement(e2);
  return n2.textContent = t2, n2;
}, P = () => {
  let e2 = document.createElement(`div`);
  return e2.className = `actions`, e2;
}, F = (e2, t2) => {
  let n2 = N(`button`, f(`cloud.native.${e2}`));
  return n2.dataset.action = e2, [`connect`, `simpleSync`, `confirmDownload`, `restoreOriginal`, `recoveryRestart`].includes(e2) && (n2.className = `primary`), e2 === `disconnect` && (n2.className = `secondary`), n2.type = `button`, n2.onclick = () => R(t2), n2;
};
async function I(e2, n2 = {}) {
  return t(`cloud_trusted_action`, { challenge: T, action: { type: e2, ...n2 } });
}
function L(e2) {
  let t2 = String(e2?.message || e2 || ``), n2 = f(`cloud.native.error.${t2}`), r2 = /^CLOUD_[A-Z0-9_]+(?::[A-Za-z0-9_-]{1,80})?$/.test(t2) ? t2 : null;
  return n2.startsWith(`cloud.native.error.`) ? f(`cloud.native.failed`) + (r2 ? ` (${r2})` : ``) : n2;
}
async function R(e2) {
  if (!(E || !T)) {
    E = true, A.hidden = true, j.setAttribute(`aria-busy`, `true`);
    for (let e3 of h.querySelectorAll(`button`)) e3.dataset.disabledBeforeRun = String(e3.disabled), e3.disabled = true;
    try {
      await e2();
    } catch (e3) {
      x = null, /CLOUD_UNLINKED|CLOUD_HTTP_401|invalid_grant/.test(String(e3)) && (O = null, j.replaceChildren(), M.replaceChildren(), z());
      let t2 = String(e3.message || e3);
      if (t2 === `CLOUD_UNLINKED`) return;
      A.textContent = L(t2), A.hidden = false, y && !b && !h.querySelectorAll(`button`).length && j.append(F(`retry`, V));
    } finally {
      E = false, j.setAttribute(`aria-busy`, `false`);
      for (let e3 of h.querySelectorAll(`button`)) Object.hasOwn(e3.dataset, `disabledBeforeRun`) && (e3.disabled = e3.dataset.disabledBeforeRun === `true`), delete e3.dataset.disabledBeforeRun;
      if (D) {
        let e3 = D;
        D = null, queueMicrotask(() => q(e3));
      } else w ? (w = false, queueMicrotask(() => R(V))) : S && (S = false, queueMicrotask(() => R(K)));
    }
  }
}
function z() {
  x = null, k.textContent = f(`cloud.native.unlinked`);
  let e2 = document.createElement(`form`), t2 = N(`label`, f(`cloud.native.device`)), n2 = document.createElement(`input`);
  n2.maxLength = 80, n2.required = true, n2.autocomplete = `off`, n2.value = `GP-Next`, t2.append(n2);
  let r2 = N(`label`, f(`cloud.native.readOnly`));
  r2.className = `check-row`;
  let i2 = document.createElement(`input`);
  i2.type = `checkbox`, r2.prepend(i2);
  let a2 = F(`connect`, async () => {
    if (!e2.reportValidity()) return;
    let t3 = { lifecycle: T, notice: null };
    C = t3;
    try {
      b = (await I(`authorize`, { deviceName: n2.value, readOnly: i2.checked })).authorizationGeneration, k.textContent = f(`cloud.native.authorizing`), j.replaceChildren(F(`cancel`, async () => {
        b = null, await I(`cancel_authorization`), j.replaceChildren(), z();
      })), t3.notice && J(t3.notice);
    } finally {
      C === t3 && (C = null);
    }
  });
  e2.onsubmit = (e3) => e3.preventDefault(), e2.append(t2, r2, a2), j.append(e2);
}
async function B() {
  if (v = await I(`local_state`), j.replaceChildren(), M.replaceChildren(), v.selectionContext) {
    try {
      await I(`select`, { plan: p(v.selectionContext) });
    } catch (e2) {
      throw await I(`cancel_operation`).catch(() => {
      }), e2;
    }
    return x?.id === v.selectionContext.sourceId && (x.confirmed = true), k.textContent = f(v.selectionContext.mode === `capture` ? `cloud.native.capturing` : `cloud.native.restoring`), true;
  }
  if (v.review && v.operationId) {
    let e2 = v.review;
    if (y && v.intent?.simpleRestore && !e2.recovery && !e2.localRollback) return await I(`confirm`, { operationId: v.operationId, decision: `apply` }), k.textContent = f(`cloud.native.restoring`), true;
    k.textContent = f(e2.localRollback ? `cloud.native.recoveryChanged` : `cloud.native.recovery`);
    let t2 = (e3) => async () => {
      await I(`confirm`, { operationId: v.operationId, decision: e3 }), k.textContent = f(`cloud.native.restoring`), j.replaceChildren();
    };
    return e2.localRollback && j.append(F(`restoreOriginal`, t2(`restore_backup`))), j.append(F(e2.localRollback ? `keepCurrent` : `rollback`, t2(`rollback`))), true;
  }
  if (v.workerFailed || v.intent?.mode === `recovery`) return k.textContent = f(`cloud.native.recovery`), j.append(F(`recoveryRestart`, async () => {
    await I(`restart_recovery`);
  }), F(`cancelOperation`, async () => {
    await I(`cancel_operation`), await V();
  })), true;
  if (v.intent) {
    if (v.intent.phase === `failed`) throw Error(v.intent.error || `CLOUD_LOCAL_WRITE`);
    return k.textContent = f(v.intent.mode === `capture` ? `cloud.native.capturing` : v.intent.waitingMenu ? `cloud.native.menuForRestore` : `cloud.native.restoring`), j.append(F(`cancelOperation`, async () => {
      x = null, await I(`cancel_operation`), await V();
    })), true;
  }
  return false;
}
async function V() {
  if (O = await I(`status`), v = await I(`local_state`), await B()) return;
  j.replaceChildren(), M.replaceChildren(), k.textContent = f(O.writeAvailable && O.policy?.unlocked && !O.overLimit ? `cloud.native.ready` : `cloud.native.readOnlyState`);
  let e2 = new Date(O.head?.createdAt || O.preferenceHead?.createdAt || ``);
  Number.isFinite(e2.valueOf()) && M.append(N(`p`, f(`cloud.native.latestBackup`, e2.toLocaleString(g))));
  let t2 = P(), n2 = O.writeAvailable && O.policy?.unlocked;
  if (n2) {
    let e3 = F(`simpleUpload`, () => H(`upload`));
    e3.disabled = !!O.overLimit, t2.append(e3);
  }
  let r2 = F(`simpleDownload`, () => U(true));
  if (r2.disabled = !O.head && !O.preferenceHead, t2.append(r2), n2) {
    let e3 = F(`simpleSync`, () => H(`sync`));
    e3.disabled = !!O.overLimit, t2.append(e3);
  }
  j.append(t2);
  let i2 = P();
  i2.className = `account-actions`, i2.append(F(`disconnect`, async () => {
    await I(`disconnect`), O = null, j.replaceChildren(), M.replaceChildren(), z();
  })), M.append(i2), v.upload && ![`committed`, `failed`, `cancelled`, `expired`, `detached`].includes(v.upload.state) && j.append(F(`retry`, async () => {
    await W(await I(`continue_upload`)), await V();
  }), F(`cancelUpload`, async () => {
    await I(`cancel_upload`), await V();
  }));
}
async function H(e2) {
  v.upload && ![`committed`, `failed`, `cancelled`, `expired`, `detached`].includes(v.upload.state) && await W(await I(`continue_upload`)), O = await I(`status`);
  let t2 = structuredClone(O);
  x = { id: (await I(`capture`, { kind: `save` })).operationId, reviewed: t2, mode: e2, confirmed: false }, await B();
}
async function U(e2) {
  O = await I(`status`);
  let t2 = O.head || O.preferenceHead;
  if (!t2) throw Error(`CLOUD_REMOTE_MISSING`);
  let n2 = O.head ? `save` : `preferences`, r2 = s(await I(`download`, { kind: n2, snapshotId: t2.id }));
  if (n2 === `save` && r2.exported.save.preferenceId && O.preferenceHead && r2.exported.save.preferenceId !== O.preferenceHead.id) throw Error(`CLOUD_BACKUP_INCOMPLETE`);
  let i2 = async () => {
    x = null, await I(`restore`), await B();
  };
  if (!e2) return i2();
  k.textContent = f(`cloud.native.confirmDownloadText`), j.replaceChildren(F(`confirmDownload`, i2), F(`cancelOperation`, V)), M.replaceChildren();
}
async function W(e2) {
  let t2 = T, n2 = 300;
  for (let r2 = 0; e2.state && ![`committed`, `failed`, `cancelled`, `expired`].includes(e2.state) && r2 < 20; r2++) {
    let r3 = Number.isInteger(e2.retryAfterSeconds) && e2.retryAfterSeconds > 0 && e2.retryAfterSeconds <= 60 ? e2.retryAfterSeconds : 1;
    if (r3 > n2) throw Error(`CLOUD_UPLOAD_PENDING`);
    n2 -= r3;
    let i2 = false, a2 = N(`button`, f(`cloud.native.stopWaiting`));
    a2.type = `button`, a2.onclick = () => {
      i2 = true, a2.disabled = true;
    }, r3 > 1 && j.append(a2);
    try {
      for (let n3 = r3; n3 > 0; n3--) if (r3 > 1 && (k.textContent = f(e2.retryReason === `cleanup` ? `cloud.native.waitingCleanup` : `cloud.native.waitingUpload`, n3)), await new Promise((e3) => setTimeout(e3, 1e3)), i2 || D || T !== t2) throw Error(`CLOUD_UPLOAD_PENDING`);
    } finally {
      a2.remove();
    }
    k.textContent = f(`cloud.native.uploading`), e2 = await I(`continue_upload`);
  }
  if (e2.state !== `committed`) throw Error(`CLOUD_UPLOAD_PENDING`);
}
async function G(e2, t2) {
  for (let n2 of [`preferences`, `save`]) e2[n2 === `save` ? `saveText` : `preferencesText`] && (k.textContent = f(`cloud.native.uploading`), await W(await I(`upload`, { kind: n2, expectedRevision: n2 === `save` ? t2.revision : t2.preferenceRevision, generation: t2.generation, createSpace: t2.spaceId === null })));
  await V(), k.textContent = f(`cloud.native.backedUp`);
}
async function K() {
  if (await B()) return;
  if (!y) {
    k.textContent = f(`cloud.native.blocked`);
    return;
  }
  let t2 = x;
  if (!t2?.confirmed || v.candidate?.id !== t2.id) {
    await V();
    return;
  }
  let i2 = v.candidate, a2 = t2.reviewed;
  if (x = null, O = await I(`status`), O.generation !== a2.generation || O.revision !== a2.revision || O.preferenceRevision !== a2.preferenceRevision) throw Error(`CLOUD_REMOTE_CHANGED`);
  if (t2.mode === `upload`) return G(i2, a2);
  let c2 = [];
  for (let t3 of [`preferences`, `save`]) {
    if (!i2[t3 === `save` ? `saveText` : `preferencesText`]) continue;
    let l3 = t3 === `save` ? a2.head : a2.preferenceHead;
    if (!l3) {
      c2.push(`local_changed`);
      continue;
    }
    let u2 = s(await I(`download`, { kind: t3, snapshotId: l3.id })), d2 = structuredClone(t3 === `save` ? u2.exported.save : u2.exported.preferences);
    t3 === `save` && delete d2.preferenceId;
    let f2 = v.baseline?.[t3], p2 = t3 === `save` ? e(new TextEncoder().encode(i2.saveText)) : n(new TextEncoder().encode(i2.preferencesText));
    c2.push(o({ local: await r(p2), remote: await r(d2), baseline: f2?.grantId === i2.grantId && f2?.generation === a2.generation ? f2.sourceDigest : null }));
  }
  let l2 = m(c2);
  if (l2 === `upload`) return G(i2, a2);
  if (l2 === `download`) return U(false);
  if (l2 === `equal`) {
    await V(), k.textContent = f(`cloud.native.synced`);
    return;
  }
  k.textContent = f(`cloud.native.syncConflict`), j.replaceChildren(F(`useLocal`, () => G(i2, a2)), F(`useCloud`, () => U(false)), F(`cancelOperation`, V)), M.replaceChildren();
}
function q(e2) {
  if (!(typeof e2 != `string` || !/^[a-f0-9]{64}$/.test(e2))) {
    if (E) {
      D = e2;
      return;
    }
    T = e2, O = null, b = null, x = null, w = false, j.replaceChildren(), M.replaceChildren(), R(async () => {
      if (y = (await t(`cloud_trusted_status`, { challenge: T })).available, !await B()) {
        if (!y) {
          k.textContent = f(`cloud.native.blocked`);
          return;
        }
        await V();
      }
    });
  }
}
window.addEventListener(`cloud-open`, (e2) => q(e2.detail));
function J(e2) {
  if (!(e2?.lifecycle && e2.lifecycle !== T)) {
    if (e2?.authorizationGeneration !== void 0 && e2.authorizationGeneration !== b) {
      let t2 = C;
      t2?.lifecycle === e2.lifecycle && [`ready`, `failed`].includes(e2.state) && (!t2.notice || e2.authorizationGeneration > t2.notice.authorizationGeneration) && (t2.notice = e2);
      return;
    }
    e2?.state === `local_ready` ? E ? S = true : R(K) : e2?.state === `ready` ? (b = null, E ? w = true : R(V)) : e2?.state === `failed` && (b = null, j.replaceChildren(), z(), A.textContent = L(e2.error), A.hidden = false);
  }
}
i(`cloud-update`, (e2) => J(e2.payload)).catch(() => {
  A.textContent = f(`cloud.native.failed`), A.hidden = false;
}), t(`cloud_trusted_status`, { challenge: `` }).then((e2) => {
  /^[a-f0-9]{64}$/.test(e2.challenge || ``) && window.dispatchEvent(new CustomEvent(`cloud-open`, { detail: e2.challenge }));
}).catch(() => {
});
