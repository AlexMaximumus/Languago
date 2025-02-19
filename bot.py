from telegram.ext import Application, CommandHandler
from telegram import WebAppInfo, ReplyKeyboardMarkup, KeyboardButton

TOKEN = '7838081504:AAFM56XUSaLJQUBR6dzUWkzpHGasD6rMiNs'

async def start(update, context):
    keyboard = [[KeyboardButton(
        text="Открыть LanguaGO",
        web_app=WebAppInfo(url="https://alexmaximumus.github.io/Languago/")
    )]]
    
    await update.message.reply_text(
        "Добро пожаловать в LanguaGO! Нажмите кнопку ниже, чтобы открыть приложение:",
        reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    )

def main():
    application = Application.builder().token(TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    print('Бот запущен...')
    application.run_polling()

if __name__ == '__main__':
    main()
