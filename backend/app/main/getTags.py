import pandas as pd
import numpy as np
import spacy
from flask import session

"""
    word: User input sentences(str)
"""


def get_tag(word):
    # """
    #     Get the Tag
    #     Tag: all tags, including several words.
    # """
    nlp = spacy.load('en_core_web_lg')

    tag_in_model = ['Strategy', 'Action', 'Indie', 'Casual', 'Simulation', 'RPG', 'Fantasy', 'Tactical', 'PvP', '2D', 'Competitive', 'Difficult', 'Sports', 'Multiplayer', 'Adventure', 'FPS', 'Shooter', 'Sniper', 'Racing', 'Survival', 'Cute', 'Physics', 'Science', 'VR', 'Tutorial', 'Classic', 'Gore', '"1990s"', 'Singleplayer', 'Aliens', 'Atmospheric', 'Moddable', 'Linear', 'Retro', 'Funny', 'Platformer', 'Clicker', 'Gothic', 'Isometric', 'Stealth', 'Mystery', 'Assassin', 'Comedy', 'Stylized', 'War', 'Rome', 'Historical', 'Realistic', 'Crafting', 'Trading', 'MMORPG', 'Swordplay', 'Hunting', 'Violent', 'Experience', 'Building', 'Economy', 'Education', 'Golf', 'Wargame', 'RTS', 'Diplomacy', 'Sandbox', 'Mod', 'Puzzle', 'Horror', 'Management', 'Futuristic', 'Cyberpunk', 'Destruction', 'Music', 'Driving', 'Arcade', 'Mechs', 'Robots', 'Underground', 'Exploration', '4X', 'Trains', 'Underwater', 'Lovecraftian', 'Remake', 'Dinosaurs', 'Parkour', 'Demons', 'Controller', 'Detective', 'Episodic', 'Zombies', 'Supernatural', 'Vampire', 'Space', 'Steampunk', 'Dystopian', 'Political', 'Dark', 'Medieval', 'Crime', 'Mature', 'Noir', 'Cinematic', 'Nudity', 'FMV', 'Anime', 'Military', 'Western', 'Ninja', 'Naval', 'Agriculture', 'Horses', 'Flight', 'Tanks', 'Benchmark', 'Magic', 'LEGO', 'Batman', 'Superhero', 'Offroad', 'Satire', 'Surreal', 'Capitalism', 'Bowling', 'Mythology', 'Colorful', 'Short', 'Fighting', 'CRPG', 'Pirates', 'Psychological', 'Memes', 'Psychedelic', 'Abstract', 'America', '1980s', 'Relaxing', 'Loot', 'Cartoon', 'Experimental', 'Dragons', 'Romance', 'Metroidvania', 'Parody', 'Rhythm', 'Modern', 'PvE', 'Heist', 'Politics', 'Conspiracy', 'Minimalist', 'JRPG', 'Hacking', 'Lemmings', 'Illuminati', 'Movie', 'Blood', 'MOBA', 'Runner', 'Narration', 'Chess', 'Soundtrack', 'Kickstarter', 'Investigation', 'Thriller', 'Cartoony', 'Crowdfunded', 'Transhumanism', 'Werewolves', 'Documentary', 'RPGMaker', 'Software', 'Mars', 'GameMaker', 'Utilities', 'Football', 'Soccer', 'Gambling', 'Sokoban', 'Drama', 'NSFW', 'Typing', 'Pinball', 'Voxel', 'Basketball', 'Fishing', 'Programming', 'Sailing', 'Mining', 'Otome', 'Cycling', 'Gaming', 'Pool', 'Conversation', 'Nonlinear', 'Spelling', 'Foreign', 'Hardware', 'Wrestling', 'Faith', 'Bikes']
    '''
         process the input words from users
         keywords: wanted words from user
    '''
    # print('please type in your answer:')
    SENTENCES = word.replace('\\n', '').replace('.', ' ')

    token_sentence = nlp(SENTENCES)
    keywords = []
    for token in token_sentence:
        # print(token.pos_)
        if token.pos_ == 'ADJ':
            keywords.append(token.text)
    # print(keywords)

    '''
        calculate the similarity and get top tags
        return_tag: tags with highest similarity
    '''
    return_tag = []
    temp_tag = ''
    for key in keywords:
        max_sim = 0
        key = nlp(key)
        for tg in tag_in_model:
            tg = nlp(tg)
            sim = key.similarity(tg)
            if sim > max_sim:
                max_sim = sim
                temp_tag = tg.text
        if temp_tag not in return_tag:
            return_tag.append(temp_tag)

    return return_tag
