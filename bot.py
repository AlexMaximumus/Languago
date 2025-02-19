from telegram.ext import Application, CommandHandler
from telegram import WebAppInfo, ReplyKeyboardMarkup, KeyboardButton
import logging

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TOKEN = '7838081504:AAFM56XUSaLJQUBR6dzUWkzpHGasD6rMiNs'

async def start(update, context):
    """Обработчик команды /start"""
    keyboard = [[KeyboardButton(
        text="Открыть LanguaGO",
        web_app=WebAppInfo(url="https://alexmaximumus.github.io/Languago/")
    )]]
    
    await update.message.reply_text(
        "Добро пожаловать в LanguaGO! 🎌\n"
        "Нажмите кнопку ниже, чтобы начать изучение японского языка:",
        reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    )

async def help_command(update, context):
    """Обработчик команды /help"""
    await update.message.reply_text(
        "LanguaGO - приложение для изучения японского языка.\n\n"
        "Доступные команды:\n"
        "/start - Запустить бота\n"
        "/help - Показать это сообщение"
    )

def main():
    """Основная функция"""
    try:
        application = Application.builder().token(TOKEN).build()
        
        # Добавляем обработчики команд
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        
        print('Бот LanguaGO запущен...')
        application.run_polling()
        
    except Exception as e:
        logging.error(f"Ошибка: {e}")

if __name__ == '__main__':
    main()
